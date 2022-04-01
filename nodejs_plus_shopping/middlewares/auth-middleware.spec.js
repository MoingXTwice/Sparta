const authMiddleware = require('./auth-middleware');

jest.mock('../models');

const {User} = require('../models');

test('정상적인 토큰을 넣은 경우 User.findByPk가 실행된다.', () => {
    User.findByPk = jest.fn();

    authMiddleware({
        headers: {
            authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjk5LCJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.M2pFiWjHqLcxfYd7o4nVgewcuYl1-2ufGHWpOsMU2S0',
        },
    }, {
        status: () => ({
            send: () => {},
        }),
        locals: {},
    });

    expect(User.findByPk).toHaveBeenCalledTimes(1);
    expect(User.findByPk).toHaveBeenCalledWith(99);
});

test('변조된 토큰으로 요청한 경우 로그인 후 사용하세요 라는 에러 메세지가 뜬다.', () => {
    const mockedSend = jest.fn();

    authMiddleware({
        headers: {
            authorization: 'Bearer dfs',
        },
    }, {
        status: () => ({
            send: mockedSend,
        }),
        locals: {},
    });

    expect(mockedSend).toHaveBeenCalledWith({
        errorMessage: '로그인 후 사용하세요',
    });
});