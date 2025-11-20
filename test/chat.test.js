function createmsg(text, user){
    return{text,user,timestamp:Date.now(),id:`msg_${user}_${Date.now()}`};
}
test('createmessage returns correct thing',()=>{
    const msg=createmsg('hi','usr1');
    expect(msg.text).toBe('hi');
    expect(msg.user).toBe('usr1');
    expect(typeof msg.timestamp).toBe('number');
});