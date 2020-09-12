class SoundConfig{
	public id:string;
	public soundName:string;
	public coverKey:number;
	public soundType:number;
	public attrs():string[] {
		return ["id","soundName","coverKey","soundType"]
	}
}