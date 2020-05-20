let readEndpoint = ''
let writeEndpoint = ''
let stackedit = null
let saveState = null

const SAVE_STATES = {
    waiting: "⌚ Waiting",
    saving: "💾 Saving",
    done: "✅ Saved",
    failed: "🛑 Failed to save"
}

function docsifyStackEditPlugin(readEndpoint, writeEndpoint) {
    readEndpoint = readEndpoint
    writeEndpoint = writeEndpoint

    return function(hook, vm) {
        hook.init(() => {
            stackedit = new Stackedit()
        })
        
        hook.afterEach((html, next) => {
            html = `
            <div id="save-state">${saveState}</div>

            <div style="overflow: auto">
                <p style="float: right; cursor: pointer"onclick="editWithStackEdit()">
                    ✍
                    <a style="text-decoration: underline;">
                        Edit
                    </a>
                </p>
            </div>` + html
            next(html)
        })
    }
}

async function editWithStackEdit() {
    const fileName = getFileName()

    let fileContent = ''
    try {
        const response = await fetch('/read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: fileName })
        })
        if(!response.ok) throw Error(response.statusText)
        fileContent = await response.text()
    }
    catch (e)
    {
        console.error('Error fetching file content: ' + e);
        return
    }

    stackedit.openFile({
        name: fileName,
        content: {
            text: `${fileContent}`
        }
    })

    stackedit.on('fileChange', ({ content }) => {
        setSaveState(SAVE_STATES.waiting)
        debounce(() => {
            setSaveState(SAVE_STATES.saving)
            updateFile(content.text).then(() => {
                setSaveState(SAVE_STATES.done)
            }).catch(() => {
                setSaveState(SAVE_STATES.failed)
            })
        }, 2000)()
    })

    stackedit.on('close', () => {
        window.location.reload()
    })
}

async function updateFile(content) {
    const path = getFileName()
    const response = await fetch('/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: path, content })
    })
    if(!response.ok) throw Error(response.statusText)
}

function getFileName() {
    const hash = window.location.hash
    const index = hash.indexOf('?') === -1 ? hash.length : hash.indexOf('?')
    return hash.substring(2, index)
}

function setSaveState(state) {
    if(state === SAVE_STATES.waiting) return
    
    document.querySelector('#save-state').innerHTML = state
    setToastVisibility(true)

    if(state === SAVE_STATES.done) debounce(() => { setToastVisibility(false) }, 2000)()
}

function setToastVisibility(visible) {
    const el = document.querySelector('#save-state')

    if(!visible && el.classList.contains('show')) el.classList.remove('show')
    else if(!el.classList.contains('show')) el.classList.add('show')
}
