function GetPageHeight() {
    return Math.max(document.body.scrollHeight, document.body.offsetHeight,
        document.documentElement.clientHeight, document.documentElement.scrollHeight,
        document.documentElement.offsetHeight);
}

function WindowScrollNormalPosition() {
    return window.scrollY / (GetPageHeight() - window.innerHeight);
}

function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end
}

function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

function RectNormalPositionOnScreen(rectY, rectHeight, screenHeight) {
    let start = screenHeight;
    let end = -rectHeight;

    //NOTE: (x-min)/(max-min)
    let result = (rectY - start) / (end - start);

    return result;

}

function page_init(lib) {
    let _this = stage.children[0];
    let page = _this.page;
    let blinds = _this.page.blinds;

    console.log(blinds);


    function calcScrollEnd() {
        // return dots.y - dots.nominalBounds.height - padding;
        // console.log(canvas.clientHeight);
        // console.log(window.innerHeight);
        return scrollStart - (page.nominalBounds.height) + (canvas.clientHeight) - (2*padding);
        // return -(page.nominalBounds.height);
        // return scrollStart - (dots.nominalBounds.height) + (canvas.clientHeight );
    }

    let padding = 50;

    let scrollStart = page.y + padding;
    // let scrollStart = dots.y;
    let scrollEnd = calcScrollEnd();


    function onResize(e) {

        stageRatio = lib.properties.height / lib.properties.width;

        stage.scaleY = canvas.clientWidth / canvas.clientHeight * window.devicePixelRatio * stageRatio;

        scrollEnd = calcScrollEnd();
        onScroll(null);
    }

    function onScroll(e) {

        let currentScroll = WindowScrollNormalPosition();
        let blindsScroll = RectNormalPositionOnScreen(blinds.localToGlobal(0,0).y + 250, blinds.nominalBounds.height - 750, canvas.clientHeight);
        let currentFrame = clamp(blindsScroll * (blinds.totalFrames - 1), 0, blinds.totalFrames-1);
        console.log(blindsScroll);

        blinds.gotoAndStop(currentFrame);

        page.y = lerp(scrollStart, scrollEnd, currentScroll);
        // console.log("start: " + scrollStart);
        // console.log("current: " + page.y);
        // console.log("end: " + scrollEnd);
        // console.log("height: " + page.nominalBounds.height);
        // console.log("canvas h: " + canvas.clientHeight);
        // console.log("canvas w: " + canvas.clientWidth);



    }

    onResize(null);
    onScroll(null);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll);

    console.log(lib);
    console.log(stage);


    console.log(_this);
    console.log(page);

}
