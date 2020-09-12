class EventUtils {

    public static async logEvent(event: string, bundle: Object = null) {
        if (bundle != null) {
            bundle['event'] = event;
        } else {
            bundle = {
                event: event
            }
        }
        egret.log(bundle);
        if (typeof gmbox != 'undefined' && gmbox["logEvent"]) {
            gmbox['logEvent'](bundle);
        }
        Facebook.logEvent(event, 1, bundle);
    }


}
