const {requireauth}=require('../middleware/authentication')
describe('requireauth middleware',()=>{
  test('call next for auth user',()=>{
    const req={session:{user:{authenticated:true}}};
    const res={};
    const next=jest.fn();
    requireauth(req,res,next);
    expect(next).toHaveBeenCalled();
  });
  test('redirects unauth user',()=>{
    const req={session:{user:{authenticated:false}}};
    const res={redirect:jest.fn()};
    const next=jest.fn();
    requireauth(req,res,next);
    expect(res.redirect).toHaveBeenCalledWith('/login.html');
    expect(next).not.toHaveBeenCalled();
  });
});
