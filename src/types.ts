export type ChannelData = {
    id: string,
    server: string,
    port: number,
    playerId: string,
    playerToken: string,
    role: string,

    expoPushToken?: string,
    steamAuthToken?: string
};

export type AppData = {
    channels: {[key: string]: ChannelData}
};
