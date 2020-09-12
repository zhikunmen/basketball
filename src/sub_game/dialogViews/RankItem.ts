class RankItem extends eui.ItemRenderer {
	public constructor() {
		super();
		this.skinName = "resource/assets/exml/ItemView.exml";
	}

	public m_item_rank_text: eui.BitmapLabel;
	public m_item_rank_image: eui.Image;
	public m_item_avatar: eui.Image;
	public m_item_name: eui.Label;
	public m_item_score: eui.Label;

	protected childrenCreated() {
		super.childrenCreated();
	}

	protected dataChanged() {
		let data = this.data as FacebookPlayerInfoInRank;
		this.setRankView(data.playerRank);
		this.m_item_avatar.source = data.playerPicUrl;
		this.m_item_name.text = data.playerName + "";
		this.m_item_score.text = data.playerScore + "";
	}

	private setRankView(rank: number): void {
		if (rank == 1) {
			this.m_item_rank_image.visible = true;
			this.m_item_rank_text.visible = false;
			this.m_item_rank_image.source = "2048_hz_1_png";
		} else if (rank == 2) {
			this.m_item_rank_image.visible = true;
			this.m_item_rank_text.visible = false;
			this.m_item_rank_image.source = "2048_hz_2_png";
		} else if (rank == 3) {
			this.m_item_rank_image.visible = true;
			this.m_item_rank_text.visible = false;
			this.m_item_rank_image.source = "2048_hz_3_png";
		} else {
			this.m_item_rank_image.visible = false;
			this.m_item_rank_text.visible = true;
			this.m_item_rank_text.text = rank + "";
		}
	}
}