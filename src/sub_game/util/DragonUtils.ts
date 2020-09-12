class DragonUtils {

    static createDragonBones(dragonData: string | any, json: string, png?: string) {
        var dragonbonesData = RES.getRes(dragonData);
        if (dragonbonesData == null || dragonbonesData == undefined) {
            return null;
        }
        if (png && png != null) {
            var textureData = RES.getRes(json);
            var texture = RES.getRes(png);
        }
        else {
            var textureData = RES.getRes(json + "_json");
            var texture = RES.getRes(json + "_png");
        }
        if (dragonBones) {
            var factory = new dragonBones.EgretFactory();
            // let factory = dragonBones.EgretFactory.factory;
            factory.parseDragonBonesData(dragonbonesData); // 解析骨骼动画数据
            factory.parseTextureAtlasData(textureData, texture); // 解析贴图数据
            return factory;
        }
        else {
            return null;
        }
    }

    static createDragonBonesDisplay(dragonData: string | any, json: string, png?: string, bones?: string, cache?: number) {
        var dragonbonesData = RES.getRes(dragonData);
        if (dragonbonesData == null || dragonbonesData == undefined) {
            return null;
        }
        if (png && png != null) {
            var textureData = RES.getRes(json);
            var texture = RES.getRes(png);
        }
        else {
            var textureData = RES.getRes(json + "_json");
            var texture = RES.getRes(json + "_png");
        }
        if (this.stringIsNullOrEmpty(bones))
            bones = "armature";
        var armature;
        if (dragonBones) {
            var factory = new dragonBones.EgretFactory();
            // let factory = dragonBones.EgretFactory.factory;
            factory.parseDragonBonesData(dragonbonesData); // 解析骨骼动画数据
            factory.parseTextureAtlasData(textureData, texture); // 解析贴图数据
            if (cache) {
                armature = factory.buildFastArmature(bones);
                armature.enableAnimationCache(cache);
            }
            else {
                armature = factory.buildArmature(bones); // 创建 Armature
            }
        }
        return armature;
    };

    static stringIsNullOrEmpty(value): boolean {
        return value == null || value.length == 0;
    };

    static removeFromParent(obj) {
        if (obj && obj.parent) {
            obj.parent.removeChild(obj);
        }
    };

}