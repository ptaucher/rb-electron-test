module.exports = [
    {
        label: 'Electron',
        submenu: [
            {
                label: 'DevTools',
                role: 'toggleDevTools'
            },
            {
                role: 'toggleFullScreen'
            },
            {
                role: 'toggleFullScreen'
            },
            {
                label: 'Edit',
                submenu: [
                    {role: 'undo'},
                    {role: 'redo'},
                    {role: 'copy'},
                    {role: 'paste'}
                ]
            },
            {
                label: 'Exit'
            }
        ]
    },
    {
        label: 'Actions',
        submenu: [
            {
                label: 'One',
                enabled: false
            },
            {label: 'Two',
                submenu: [
                    {label: 'One'},
                    {label: 'Two'},
                    {label: 'Three'}
                ]},
            {
                label: 'Three',
                click: () => { console.log('Three') },
                accelerator: 'Shift+Alt+G'
            }
        ]
    }
]
