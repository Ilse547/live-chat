const {logger}=require('../middleware/logger');
describe('logger',()=>{
  test('calsl next',()=>{
    const req={ip:'255.255.255.255',method:'GET',originalUrl:'/'};
    const res={};
    const next=jest.fn();
    logger(req,res,next);
    expect(next).toHaveBeenCalled();
  });
});
