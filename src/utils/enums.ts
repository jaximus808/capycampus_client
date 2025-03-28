enum server_packets {
    welcome_packet,
    gameinfo_packet,
    client_join,
    client_leave,
    create_move_packet
}
enum client_packets {
	ping,
    ready,
	move
}
export {server_packets, client_packets}