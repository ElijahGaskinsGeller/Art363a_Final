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
    let fallThroughSkyClouds = [fallThroughSky.cloud_front, fallThroughSky.cloud_0, fallThroughSky.cloud_1, fallThroughSky.cloud_2];
    let fallThroughSkyCloudPositions = [fallThroughSkyClouds[0].y, fallThroughSkyClouds[1].y, fallThroughSkyClouds[2].y, fallThroughSkyClouds[3].y];
    let cloudTransitionFront = fallThroughSky.cloud_transition_front;
    let cloudTransitionFrontPos = cloudTransitionFront.y;

    let cloudTransitionBack = fallThroughSky.cloud_transition_back;
    let cloudTransitionBackPos = cloudTransitionBack.y;

    cloudTransitionFront.bird_fly_in.gotoAndStop(cloudTransitionFront.bird_fly_in.totalFrames - 1);
    cloudTransitionFront.bird_fly_in.loop = 0;
    cloudTransitionFront.bird_fly_in.alpha = 0;


    cloudTransitionFront.bird_fly_away.gotoAndStop(0);
    cloudTransitionFront.bird_fly_away.loop = 0;

    fallThroughSky.cloud_2.bird_fly_away.loop = 0;
    fallThroughSky.cloud_2.bird_fly_away.alpha = 0;
    fallThroughSky.cloud_2.bird_fly_away.gotoAndStop(0);
    fallThroughSky.cloud_2.bird_fly_in.loop = 0;
    fallThroughSky.cloud_2.bird_fly_in.alpha = 0;
    fallThroughSky.cloud_2.bird_fly_in.gotoAndStop(0);

    console.log("create js");
    console.log(createjs);

    console.log(fallThroughSky.cloud_2.bird_fly_away);
    let frameNumber = "frame_"+fallThroughSky.cloud_2.bird_fly_away.totalFrames;
    fallThroughSky.cloud_2.bird_fly_away.frame_1 = function() {
        console.log("on frame event");
    }

    let fallTowardsCamera = page.fall_towards_camera;
    let fallTowardsCameraCharacterY = fallTowardsCamera.character.y;


    let endLand = page.end_land;
    console.log(endLand);
    endLand.room.alpha = 0;

    let birdFly = false;
    let birdFlying = false;


    document.head.insertAdjacentHTML("beforeend", `<style>.container{ height: ` + page.nominalBounds.height + `px !important;}</style>`)


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


        let fallThroughSkyScroll = RectNormalPositionOnScreen(page.y + fallThroughSky.y, fallThroughSky.nominalBounds.height, canvas.clientHeight);


        if (fallThroughSkyScroll >= 0 && fallThroughSkyScroll <= 1) {
            fallThroughSky.character.y = Math.abs(page.y) - fallThroughSky.y + (canvas.clientHeight / 2) + (fallThroughSky.character.nominalBounds.height / 2);
            fallThroughSky.scream_text.y = fallThroughSky.character.y - 50;


            let fallThroughSkyCurrentFrame = Math.abs(clamp(fallThroughSkyScroll * fallThroughSky.character.totalFrames - 1, 0, fallThroughSky.character.totalFrames - 1));
            fallThroughSky.character.gotoAndStop(fallThroughSkyCurrentFrame);

            let screamTextScroll = RectNormalPositionOnScreen(page.y + fallThroughSky.y + 500, fallThroughSky.nominalBounds.height, canvas.clientHeight);
            let screamTextCurrentFrame = Math.abs(clamp(screamTextScroll * fallThroughSky.scream_text.totalFrames - 1, 0, fallThroughSky.scream_text.totalFrames - 1));
            fallThroughSky.scream_text.gotoAndStop(screamTextCurrentFrame);

            fallThroughSkyClouds[0].y = fallThroughSkyCloudPositions[0] + (-600 * fallThroughSkyScroll);
            fallThroughSkyClouds[1].y = fallThroughSkyCloudPositions[1] + (-200 * fallThroughSkyScroll);
            fallThroughSkyClouds[2].y = fallThroughSkyCloudPositions[2] + (0 * fallThroughSkyScroll);
            fallThroughSkyClouds[3].y = fallThroughSkyCloudPositions[3] + (100 * fallThroughSkyScroll);

            let cloudTransitionScroll = RectNormalPositionOnScreen(page.y + fallThroughSky.y + 1500, fallThroughSky.nominalBounds.height, canvas.clientHeight);
            cloudTransitionFront.y = cloudTransitionFrontPos + (-400 * cloudTransitionScroll);
            cloudTransitionBack.y = cloudTransitionBackPos + (100 * cloudTransitionScroll);

            if (!birdFly && !birdFlying &&
                (cloudTransitionFront.bird_fly_away.currentFrame <= 0 || fallThroughSky.cloud_2.bird_fly_away.currentFrame >= fallThroughSky.cloud_2.bird_fly_away.totalFrames - 1 ) &&
                cloudTransitionFront.bird_fly_in.currentFrame >= cloudTransitionFront.bird_fly_in.totalFrames - 1 &&
                fallThroughSkyScroll > .5) {

                cloudTransitionFront.bird_fly_away.gotoAndPlay(0);
                cloudTransitionFront.bird_fly_away.alpha = 1;
                cloudTransitionFront.bird_fly_in.alpha = 0;

                birdFly = true;
                birdFlying = true;

                setTimeout(function () {
                    birdFlying = false;
                    fallThroughSky.cloud_2.bird_fly_in.alpha = 1;
                    fallThroughSky.cloud_2.bird_fly_in.gotoAndPlay(0);
                }, 1000);
            } else if (birdFly && !birdFlying &&
                       fallThroughSky.cloud_2.bird_fly_in.currentFrame >= fallThroughSky.cloud_2.bird_fly_in.totalFrames - 1 &&
                       fallThroughSkyScroll < .35) {

                fallThroughSky.cloud_2.bird_fly_in.alpha = 0;

                fallThroughSky.cloud_2.bird_fly_away.gotoAndPlay(0);
                fallThroughSky.cloud_2.bird_fly_away.alpha = 1;

                birdFlying = true;
                birdFly = false;

                setTimeout(function () {
                    birdFlying = false;
                    cloudTransitionFront.bird_fly_in.alpha = 1;
                    cloudTransitionFront.bird_fly_away.alpha = 0;
                    cloudTransitionFront.bird_fly_in.gotoAndPlay(0);
                }, 2500);
            }

        }


        let fallTowardsCameraScroll = RectNormalPositionOnScreen(fallTowardsCamera.localToGlobal(0, 0).y + 250, fallTowardsCamera.nominalBounds.height - 750, canvas.clientHeight);
        let fallTowardsCameraCurrentFrame = Math.abs(clamp(fallTowardsCameraScroll * fallTowardsCamera.totalFrames - 1, 0, fallTowardsCamera.totalFrames - 1));
        fallTowardsCamera.gotoAndStop(fallTowardsCameraCurrentFrame);

        if (WindowScrollNormalPosition() >= .99) {
            endLand.room.alpha = 1;
            endLand.land.alpha = 0;
        } else {
            endLand.room.alpha = 0;
            endLand.land.alpha = 1;
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
