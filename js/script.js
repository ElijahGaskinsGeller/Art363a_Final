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

function RectNormalPositionOnScreen(rectY, rectHeight, screenHeight) {
    let start = screenHeight;
    let end = -rectHeight;

    //NOTE: (x-min)/(max-min)
    let result = (rectY - start) / (end - start);

    return result;

}

function page_init(lib) {
    let _this = stage.children[0];
    // let dots = _this.dots;


    function calcScrollEnd() {
        // return scrollStart - (dots.nominalBounds.height) + (canvas.clientHeight) - (2*padding);
    }

    let padding = 50;

    // let scrollStart = dots.y + padding;
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
        // let currentFrame = Math.min(dots.totalFrames - 1, currentScroll * (dots.totalFrames - 1));

        // dots.gotoAndStop(currentFrame);

        // dots.y = lerp(scrollStart, scrollEnd, currentScroll);
        // console.log("start: " + scrollStart);
        // console.log("current: " + dots.y);
        // console.log("end: " + scrollEnd);
        // console.log("height: " + dots.nominalBounds.height);
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
    // console.log(dots);

}
