var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var DragonUtils = (function () {
    function DragonUtils() {
    }
    DragonUtils.createDragonBones = function (dragonData, json, png) {
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
    };
    DragonUtils.createDragonBonesDisplay = function (dragonData, json, png, bones, cache) {
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
    ;
    DragonUtils.stringIsNullOrEmpty = function (value) {
        return value == null || value.length == 0;
    };
    ;
    DragonUtils.removeFromParent = function (obj) {
        if (obj && obj.parent) {
            obj.parent.removeChild(obj);
        }
    };
    ;
    return DragonUtils;
}());
__reflect(DragonUtils.prototype, "DragonUtils");
