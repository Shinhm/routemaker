import React from 'react';
import './index.scss';
import Lottie from 'react-lottie';
import enterLottie from '../assets/animation/lottie/enter-lottie.json';
import FirebaseService, { FireStoreSchema } from '../services/FirebaseService';
import SessionStorageService from '../services/SessionStorageService';
import { Button, useTheme } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import useQuery from '../hooks/useQuery';

export const makeInviteCode = async () => {
  const randomNumber = Math.round(Math.random() * 9999999).toString();
  const encValue = btoa(randomNumber);
  const hasInviteCode = await FirebaseService.hasInviteCode(
    FireStoreSchema.route,
    randomNumber
  );

  if (hasInviteCode) {
    return makeInviteCode;
  }

  return encValue;
};

function Index() {
  const history = useHistory();
  const theme = useTheme();
  const { query } = useQuery();
  const lottieOption = {
    loop: true,
    autoplay: true,
    animationData: enterLottie,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const kakaoLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const redirectUrl = (query.continue || '/user') as string;
    const Kakao = window.Kakao;
    Kakao.Auth.login({
      success: (authObj: any) => {
        SessionStorageService.set({
          key: 'kakaoAuth',
          value: JSON.stringify(authObj),
        });
        history.push(redirectUrl);
      },
      fail: function (err: any) {
        alert(JSON.stringify(err));
      },
    });
  };

  return (
    <div
      className="enter-main space-align-container"
      style={{ backgroundColor: theme.palette.primary.main }}
    >
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
            onClick={async () => {
              const id = await makeInviteCode();
              history.replace(`/${id}/trip`);
            }}
          >
            비회원으로 시작하기
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Index;
