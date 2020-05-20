let createState

function docsifyCreatePlugin() {
    return function(hook, _vm) {
        hook.afterEach((html, next) => {
            html = `
            <div id="create-state"></div>

            <p style="float: right; cursor: pointer; margin-left: 16px"onclick="createPluginOnClick()">
                💾
                <a style="text-decoration: underline;">
                    New Page
                </a>
            </p>` + html
            next(html)
        })
    }
}

function createPluginOnClick() {
    let route = prompt('New page route')
    if(route.charAt(0) !== '/') route = '/' + route
    if(route.substr(-3) === '.md') route = route.substr(0, route.length - 3)

    createFile(route).then(() => {
        window.location = '/#' + route
    }).catch(err => {
        console.error(err)
        document.querySelector('#create-state').innerHTML = err
        setCreateStateToastVisibility(true)
        debounce(() => {setCreateStateToastVisibility(false)}, 5000)()
    })
}

async function createFile(route) {
    const response = await fetch('/create', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: route })
    })
    if(!response.ok) throw Error(await response.text())
}

function setCreateStateToastVisibility(visible) {
    const el = document.querySelector('#create-state')

    if(!visible && el.classList.contains('show')) el.classList.remove('show')
    else if(!el.classList.contains('show')) el.classList.add('show')
}
