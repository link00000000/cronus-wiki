function docsifyDeletePlugin() {
    return function(hook, _vm) {
        hook.afterEach((html, next) => {
            if(window.location.hash === '#/') return next(html)
            
            html = `
            <div id="delete-state">Error deleting file</div>

            <p style="float: right; cursor: pointer; margin-left: 16px"onclick="deletePluginOnClick()">
                🚫
                <a style="text-decoration: underline;">
                    Delete
                </a>
            </p>` + html
            next(html)
        })
    }
}

function deletePluginOnClick() {
    if(confirm("You are about to delete this file, is this OK?")) {
        deleteFile().then(() => {
            window.location.replace('/')
        }).catch(err => {
            console.error(err)
            setDeleteStateToastVisibility(true)
            debounce(() => {setDeleteStateToastVisibility(false)}, 5000)()
        })
    }
}

async function deleteFile() {
    const path = getFileName()
    const response = await fetch('/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: path })
    })
    if(!response.ok) throw Error(response.statusText)
}

function getFileName() {
    const hash = window.location.hash
    const index = hash.indexOf('?') === -1 ? hash.length : hash.indexOf('?')
    return hash.substring(2, index)
}

function setDeleteStateToastVisibility(visible) {
    const el = document.querySelector('#delete-state')

    if(!visible && el.classList.contains('show')) el.classList.remove('show')
    else if(!el.classList.contains('show')) el.classList.add('show')
}
