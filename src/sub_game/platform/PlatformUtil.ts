class PlatfromUtil {

    static getPlatformEnum() {
        if (Facebook.isFBInit()) {
            return PlatfromEnum.FACEBOOK;
        } else if (Utils.isRuntime) {
            return PlatfromEnum.GMBOX;
        } else {
            return PlatfromEnum.GP;
        }
    }

    static getPlatform(): platform.IPlatform {
        if (Facebook.isFBInit()) {
            return new FacebookPlatform();
        } else if (Utils.isRuntime) {
            return new GmBoxPlatform();
        } else {
            return new GmBoxPlatform;
        }
    }

}