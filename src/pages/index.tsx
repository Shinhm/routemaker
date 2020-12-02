import React from 'react';
import './index.scss';
import Lottie from 'react-lottie';
import enterLottie from '../assets/animation/lottie/enter-lottie.json';
import FirebaseService from '../services/FirebaseService';
import SessionStorageService from '../services/SessionStorageService';
import { Button } from '@material-ui/core';

function Index() {
  const lottieOption = {
    loop: true,
    autoplay: true,
    animationData: enterLottie,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const makeInviteCode = async () => {
    const randomNumber = Math.round(Math.random() * 9999999).toString();
    const encValue = btoa(randomNumber);
    const hasInviteCode = await FirebaseService.hasInviteCode(
      'routeMaker',
      randomNumber
    );

    if (hasInviteCode) {
      return makeInviteCode;
    }
    SessionStorageService.set({ key: 'codeEnabled', value: true });
    window.location.replace(`/${encValue}/trip`);
  };

  const kakaoLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const Kakao = (window as any).Kakao;
    Kakao.Auth.login({
      success: async function (authObj: any) {
        // // alert(JSON.stringify(authObj));
        //
        // console.log(me);
      },
      fail: function (err: any) {
        alert(JSON.stringify(err));
      },
    });
  };

  return (
    <div className="enter-main space-align-container">
      <div className="space-align-block">
        <Lottie
          options={lottieOption}
          height={350}
          width={350}
          style={{ margin: 'auto' }}
        />
        <div
          style={{
            width: 350,
            margin: '10px auto',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button onClick={kakaoLogin}>
            <img
              src="//k.kakaocdn.net/14/dn/btqCn0WEmI3/nijroPfbpCa4at5EIsjyf0/o.jpg"
              width="222"
              alt={''}
            />
          </Button>
        </div>
        <div style={{ width: 350, margin: '10px auto', display: 'flex' }}>
          <Button
            style={{ width: 200, margin: 'auto' }}
            onClick={makeInviteCode}
          >
            비회원으로 시작하기
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Index;
