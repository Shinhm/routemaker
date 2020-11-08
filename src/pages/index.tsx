import React from 'react';
import Search from 'antd/es/input/Search';
import './index.scss';
import { Button } from 'antd';
import Lottie from 'react-lottie';
import enterLottie from '../assets/animation/lottie/enter-lottie.json';
import FirebaseService from '../services/FirebaseService';
import SessionStorageService from '../services/SessionStorageService';

function Index() {
  const lottieOption = {
    loop: true,
    autoplay: true,
    animationData: enterLottie,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const onSearch = async (value: string) => {
    if (value.length < 5) {
      alert('5자 이상을 입력해주세요.');
      return;
    }
    const hasInviteCode = await FirebaseService.hasInviteCode(value);
    if (!hasInviteCode) {
      return alert('초대 코드가 존재하지 않습니다.');
    }
    SessionStorageService.set({ key: 'codeEnabled', value: true });
    window.location.replace(`/${value}/trip`);
  };

  const makeInviteCode = async () => {
    const randomNumber = Math.round(Math.random() * 9999999).toString();
    const encValue = btoa(randomNumber);
    const hasInviteCode = await FirebaseService.hasInviteCode(randomNumber);

    if (hasInviteCode) {
      return makeInviteCode;
    }
    SessionStorageService.set({ key: 'codeEnabled', value: true });
    window.location.replace(`/${encValue}/trip`);
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
        <div style={{ width: 350, margin: '10px auto', display: 'flex' }}>
          <Search
            placeholder="초대코드 입력하기"
            onSearch={onSearch}
            style={{ width: 200, margin: 'auto' }}
          />
        </div>
        <div style={{ width: 350, margin: '10px auto', display: 'flex' }}>
          <Button
            ghost
            block
            style={{ width: 200, margin: 'auto' }}
            onClick={makeInviteCode}
          >
            코드 생성하기
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Index;
