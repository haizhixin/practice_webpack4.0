document.addEventListener('click', () => {
    /* webpackChunkName: true */ //按需加载 用到时下载
    import( /* webpackPrefetch: true */ './click.js').then(({ default: func }) => {
        func();
    })
});