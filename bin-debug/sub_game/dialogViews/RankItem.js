var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var RankItem = (function (_super) {
    __extends(RankItem, _super);
    function RankItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "resource/assets/exml/ItemView.exml";
        return _this;
    }
    RankItem.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
    };
    RankItem.prototype.dataChanged = function () {
        var data = this.data;
        this.setRankView(data.playerRank);
        this.m_item_avatar.source = data.playerPicUrl;
        this.m_item_name.text = data.playerName + "";
        this.m_item_score.text = data.playerScore + "";
    };
    RankItem.prototype.setRankView = function (rank) {
        if (rank == 1) {
            this.m_item_rank_image.visible = true;
            this.m_item_rank_text.visible = false;
            this.m_item_rank_image.source = "2048_hz_1_png";
        }
        else if (rank == 2) {
            this.m_item_rank_image.visible = true;
            this.m_item_rank_text.visible = false;
            this.m_item_rank_image.source = "2048_hz_2_png";
        }
        else if (rank == 3) {
            this.m_item_rank_image.visible = true;
            this.m_item_rank_text.visible = false;
            this.m_item_rank_image.source = "2048_hz_3_png";
        }
        else {
            this.m_item_rank_image.visible = false;
            this.m_item_rank_text.visible = true;
            this.m_item_rank_text.text = rank + "";
        }
    };
    return RankItem;
}(eui.ItemRenderer));
__reflect(RankItem.prototype, "RankItem");
