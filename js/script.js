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
    let blinds = page.blinds;
    let fallOnBed = page.fall_on_bed;
    let sinkIntoBed = page.sinking_into_bed;
    let fallThroughSky = page.fall_through_sky;

    console.log(blinds);


    function calcScrollEnd() {
        // return dots.y - dots.nominalBounds.height - padding;
        // console.log(canvas.clientHeight);
        // console.log(window.innerHeight);
        return scrollStart - (page.nominalBounds.height) + (canvas.clientHeight) - (2 * padding);
        // return -(page.nominalBounds.height);
        // return scrollStart - (dots.nominalBounds.height) + (canvas.clientHeight );
    }

    let padding = 0;

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

        let blindsScroll = RectNormalPositionOnScreen(blinds.localToGlobal(0, 0).y + 250, blinds.nominalBounds.height - 750, canvas.clientHeight);
        let blindsCurrentFrame = clamp(blindsScroll * (blinds.totalFrames - 1), 0, blinds.totalFrames - 1);
        blinds.gotoAndStop(blindsCurrentFrame);


        let fallOnBedScroll = RectNormalPositionOnScreen(fallOnBed.localToGlobal(0, 0).y - 100, fallOnBed.nominalBounds.height - 100, canvas.clientHeight);
        let fallOnBedCurrentFrame = clamp(fallOnBedScroll * (fallOnBed.totalFrames - 1), 0, fallOnBed.totalFrames - 1);
        fallOnBed.gotoAndStop(fallOnBedCurrentFrame);

        let sinkIntoBedScroll = RectNormalPositionOnScreen(sinkIntoBed.localToGlobal(0, 0).y + 150, sinkIntoBed.nominalBounds.height - 250, canvas.clientHeight);
        let sinkIntoBedCurrentFrame = clamp(sinkIntoBedScroll * sinkIntoBed.totalFrames - 1, 0, sinkIntoBed.totalFrames - 1);
        sinkIntoBed.gotoAndStop(sinkIntoBedCurrentFrame);

        page.y = lerp(scrollStart, scrollEnd, currentScroll);

        // let fallThroughSkyScroll = RectNormalPositionOnScreen(fallThroughSky.localToGlobal(0, 0).y-canvas.clientHeight, fallThroughSky.nominalBounds.height, canvas.clientHeight);
        let fallThroughSkyScroll = RectNormalPositionOnScreen(page.y + fallThroughSky.y , fallThroughSky.nominalBounds.height, canvas.clientHeight);
        console.log("fall through sky scroll: " + fallThroughSkyScroll);
        // console.log("page: " + page.y);
        // console.log("fall through sky: " + fallThroughSky.y);
        // console.log("character: " + fallThroughSky.character.y);
        // console.log("canvas height: " + canvas.clientHeight);
        // console.log("fall through sky global: "+fallThroughSky.localToGlobal(0,0).y);
        // console.log(fallThroughSky.nominalBounds);

        if (fallThroughSkyScroll >= 0 && fallThroughSkyScroll <= 1) {
            // fallThroughSky.character.y = fallThroughSky.globalToLocal(0,canvas.clientHeight/2).y - 25;
            fallThroughSky.character.y = Math.abs(page.y) - fallThroughSky.y + (canvas.clientHeight / 2) + (fallThroughSky.character.nominalBounds.height / 2);
            fallThroughSky.scream_text.y = fallThroughSky.character.y - 50;


            let fallThroughSkyCurrentFrame = Math.abs(clamp(fallThroughSkyScroll * fallThroughSky.character.totalFrames - 1, 0, fallThroughSky.character.totalFrames - 1));
            fallThroughSky.character.gotoAndStop(fallThroughSkyCurrentFrame);

            // let screamTextScroll = RectNormalPositionOnScreen(fallThroughSky.localToGlobal(0, 0).y + 500, fallThroughSky.nominalBounds.height, canvas.clientHeight);
            let screamTextScroll = RectNormalPositionOnScreen(page.y + fallThroughSky.y +500, fallThroughSky.nominalBounds.height, canvas.clientHeight);
            let screamTextCurrentFrame = Math.abs(clamp(screamTextScroll * fallThroughSky.scream_text.totalFrames - 1, 0, fallThroughSky.scream_text.totalFrames - 1));
            fallThroughSky.scream_text.gotoAndStop(screamTextCurrentFrame);
        }

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
