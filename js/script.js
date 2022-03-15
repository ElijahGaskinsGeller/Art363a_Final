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


    document.head.insertAdjacentHTML("beforeend", `<style>.container{ height: `+page.nominalBounds.height+`px !important;}</style>`)


    console.log(blinds);


    function calcScrollEnd() {
        return scrollStart - (page.nominalBounds.height) + (canvas.clientHeight) - (2 * padding);
    }

    let padding = 0;

    let scrollStart = page.y + padding;
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


        let fallThroughSkyScroll = RectNormalPositionOnScreen(page.y + fallThroughSky.y , fallThroughSky.nominalBounds.height, canvas.clientHeight);
        console.log("fall through sky scroll: " + fallThroughSkyScroll);

        if (fallThroughSkyScroll >= 0 && fallThroughSkyScroll <= 1) {
            fallThroughSky.character.y = Math.abs(page.y) - fallThroughSky.y + (canvas.clientHeight / 2) + (fallThroughSky.character.nominalBounds.height / 2);
            fallThroughSky.scream_text.y = fallThroughSky.character.y - 50;


            let fallThroughSkyCurrentFrame = Math.abs(clamp(fallThroughSkyScroll * fallThroughSky.character.totalFrames - 1, 0, fallThroughSky.character.totalFrames - 1));
            fallThroughSky.character.gotoAndStop(fallThroughSkyCurrentFrame);

            let screamTextScroll = RectNormalPositionOnScreen(page.y + fallThroughSky.y +500, fallThroughSky.nominalBounds.height, canvas.clientHeight);
            let screamTextCurrentFrame = Math.abs(clamp(screamTextScroll * fallThroughSky.scream_text.totalFrames - 1, 0, fallThroughSky.scream_text.totalFrames - 1));
            fallThroughSky.scream_text.gotoAndStop(screamTextCurrentFrame);
        }



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
