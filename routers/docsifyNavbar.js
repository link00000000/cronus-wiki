const { readdirSync, lstatSync, existsSync } = require('fs')
const { join, parse } = require('path')
const { Router } = require('express')

const router = Router()

router.get('/_navbar.md', (req, res) => {
    const root = join(process.cwd(), 'static')

    const fileTree = new Item(root)
    const markdown = fileTree.markdown()
    console.log(markdown)

    return res.send(markdown)
})

class Item {
    subItems = []
    path = null
    root = ''
    parent = null
    noUrl = false
    
    constructor(fullPath, root, parent) {
        this.path = parse(fullPath)
        this.root = root || fullPath
        this.parent = parent || null

        if(lstatSync(fullPath).isDirectory()) {
            this.noUrl = !existsSync(join(fullPath, 'README.md'))

            readdirSync(fullPath).forEach(item => {
                const itemPath = join(fullPath, item)
                this.subItems.push(new Item(itemPath, this.root, this))
            })
            this.subItems.sort((a, b) => {
                if(a > b) return 1
                if(a === b) return 0
                if(a < b) return -1
            })
        }
    }

    get isFile() {
        return lstatSync(this.fullPath + this.path.ext).isFile()
    }

    get isDirectory() {
        return !this.isFile
    }

    get fullPath() {
        return join(this.path.dir, this.path.name)
    }

    get url() {
        if(this.noUrl) return null

        let url = this.fullPath
            .replace(this.root, '/')
            .replace(/\\/g, '/')
            .replace(/\/\//g, '/')
        
        if(url.substr('README'.length * -1) === 'README')
            return url.substring(0, url.length - 'README'.length)
        
        return url
    }

    markdown(indentation = 0) {
        let text = ''

        if(indentation !== 0)
            if(this.url !== null)
                text = `* [${this.path.name}](${this.url})\n`
            else
                text = `* ${this.path.name}\n`
        
        if(this.path.name === 'README') {
            if(this.url !== '/') {
                if(this.url !== null)
                    text = `* [${this.parent.path.name}](${this.url})\n`
                else
                    text = `* ${this.parent.path.name}\n`
            } else {
                text = ''
            }
        }
        
        if(this.isDirectory) {
            this.subItems.forEach(item => {
                text += '    '.repeat(indentation) + item.markdown(indentation + 1)
            })
        }

        return text
    }
}

module.exports = router