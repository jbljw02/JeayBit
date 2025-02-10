# 암호화폐 가상 거래 서비스 'JeayBit'
> JeayBit은 기존 암호화폐 거래소들의 높은 진입장벽과 복잡성 문제를 해결하기 위해 개발된 경량화 가상 거래 프로그램입니다. <br >
> 필수적인 트레이딩 기능만을 제공하여 초보자도 쉽게 접근할 수 있으며, 실제 자산 위험 없이 거래 경험을 쌓을 수 있는 가상 환경을 제공합니다. <br>
> 또한 직관적인 인터페이스와 빠른 응답 속도를 바탕으로 누구나 쉽게 암호화폐 거래를 배울 수 있도록 돕습니다. <br>
- 배포 URL: https://jeaybit.com

<br>

## 1. 프로젝트 개요

### 개발 기간
> 2023.08.28 - 2023.12.05

### 리팩토링
> 2024.05.26 ~ 2024.07.26(웹소켓 추가 및 컴포넌트 세분화) <br>
> 2024.12.02 ~ 2024.12.20(API 최적화 및 반응형 디자인 구현)

### 인원 구성
> 이진우(1인)

### 기술

|Environment|Frontend|Backend|Database|Deployment|API|
|:---:|:---:|:---:|:---:|:---:|:---:|
|![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white) ![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)|![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)|![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white) ![Celery](https://img.shields.io/badge/celery-%23a9cc54.svg?style=for-the-badge&logo=celery&logoColor=ddf4a4)|![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)|![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white) ![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)<img width="110" alt="스크린샷 2024-07-26 15 19 21" src="https://github.com/user-attachments/assets/f853205a-8660-4e00-a903-eef43a235585"> |![Upbit](https://github.com/jbljw02/JeayBit/assets/125800649/f015f2eb-6b86-48e0-9722-11749244d6c3)|

<br>

## 2. 프로젝트 구조도
![구조도](https://github.com/user-attachments/assets/4f84c6d6-bb38-47c7-ae59-cacb7fa50c98)

## 3. 프로젝트 흐름도

### 1) 화폐 정보 불러오기
![흐름도 - 화폐 정보 불러오기](https://github.com/user-attachments/assets/8c03c37c-0542-4c43-bc98-4ec9531477fa)

### 2) 매수 및 매도
![흐름도 - 매수 및 매도 (1)](https://github.com/user-attachments/assets/0ff1beef-5995-4b22-b8bc-2e5ef81ae65f)
![흐름도 - 매수 및 매도 (2)](https://github.com/user-attachments/assets/2329310d-6699-4389-ae2e-5ac3dfb8d106)

<br>

## 4. 반응형 디자인

### 1) PC
|PC|
|:---:|
|<img width="1710" alt="PC" src="https://github.com/user-attachments/assets/14ef180b-c687-4ede-8e5f-816fe355e32c" />|

### 2) 태블릿
|태블릿 (1)|
|:---:|
|<img width="1180" alt="태블릿 - 가로" src="https://github.com/user-attachments/assets/847b8319-5313-4c35-a827-e2a41e409572" />|

|태블릿 (2)|
|:---:|
|<img width="750" alt="태블릿 - 세로" src="https://github.com/user-attachments/assets/f5ce1151-a267-4f50-a218-acbf3c6965c9" />|

|태블릿 (3)|
|:---:|
|![태블릿 상세](https://github.com/user-attachments/assets/c1be8188-0300-44ac-b09f-66e3d4028e36)|

### 3) 휴대폰
|휴대폰 (1)|
|:---:|
|<img width="400" alt="휴대폰 - 세로" src="https://github.com/user-attachments/assets/0726756d-bd67-4e8b-9d5c-6c9fb7458405" />|

|휴대폰 (2)|
|:---:|
|<img width="400" alt="휴대폰 - 상세" src="https://github.com/user-attachments/assets/d054c0c5-e568-4122-8eeb-22d007ef4a2a" />|

<br>

## 5. 화면 구성 및 주요 기능

### 1) 회원가입
- 유효성 검사(이메일과 비밀번호의 형식)를 통과해야 회원가입이 가능합니다. <br>
- 중복된 이메일이 아니어야 합니다.

|회원가입|
|:---:|
|![회원가입](https://github.com/user-attachments/assets/caa9613f-de69-4e3c-93da-228632f464ab)|

### 2) 로그인
- ID와 비밀번호가 DB의 값과 일치하면 로그인에 성공합니다.
- 로그인에 성공하면 메인화면으로 이동합니다.
- 카카오 계정을 통한 소셜 로그인이 가능합니다.

|로그인|
|:---:|
|![로그인](https://github.com/user-attachments/assets/e8240e48-0ea5-47f1-a95d-20c34a2b9582)|

|카카오 로그인|
|:---:|
|![카카오 로그인](https://github.com/user-attachments/assets/51be6a49-0da5-4d76-b543-d72f7ac95add)|

### 3) 화폐 리스트, 호가/체결내역, 차트
- 화폐의 시세는 주기적으로 갱신됩니다.
- 우측: 화폐 리스트에서 화폐 정렬/검색 및 관심 화폐 추가가 가능하며, 선택한 화폐에 따라 다른 영역이 상호작용합니다.
- 중앙: 선택한 화폐의 호가 내역과 체결 내역을 확인할 수 있습니다.
- 좌측: 선택한 화폐의 시세에 대한 차트를 분/시간/일 단위로 확인할 수 있습니다.

|화폐 리스트, 호가/체결내역|
|:---:|
|![화폐 리스트:호가 및 체결내역](https://github.com/user-attachments/assets/ca64af8b-182e-4461-850f-444cc95216d8)|

|차트|
|:---:|
|![차트](https://github.com/user-attachments/assets/b532c94e-375d-40d9-8157-1287c0a075df)|

### 4) 입금 및 출금
- 사용자가 원하는 금액만큼 입금 및 출금이 가능합니다.
- 입금된 금액을 이용해 화폐를 매수할 수 있습니다.
- 1회의 입금 및 출금에 제한액이 있습니다.

|입금 및 출금|
|:---:|
|![지갑 관리](https://github.com/user-attachments/assets/93235e0f-9384-4def-83e8-252aa59b425d)|

### 5) 화폐 거래, 거래 내역
- 매수 및 매도를 할 때 호가와 일치하는 가격 혹은 시장가로 요청하면 즉시 거래가 체결됩니다.
- 거래가 체결되면 보유 화폐의 수량이 증가하며, 해당 거래가 거래내역에 추가됩니다.
- (1) - 호가와 거래 요청가가 일치하지 않는다면 거래가 체결되지 않습니다. 미체결 거래는 Celery에 의해 백그라운드에서 호가와 일치하는지 비교됩니다.
- (2) - 호가와 거래 요청가가 일치한다면 거래를 체결시키고 웹 소켓을 통해 클라이언트에게 거래가 체결됐음을 알립니다.
- (3) - 체결된 거래들은 '거래내역'에서 확인할 수 있습니다. 미체결 거래에 대한 주문은 취소할 수 있습니다.
  
|(1) 매수|
|:---:|
|![화폐 매수:거래 체결](https://github.com/user-attachments/assets/b4d769fb-b12f-4180-8013-2af09cea4f9b)|

|(2) 거래 체결 알림|
|:---:|
|<img width="1710" alt="거래 체결 알림" src="https://github.com/user-attachments/assets/c15f0b89-2263-4eb7-a110-40839306a90a" />|

|(3) 매도|
|:---:|
|![화폐 매도:거래 취소](https://github.com/user-attachments/assets/fe3367d5-1c0a-4aae-8d54-f57110e30273)|
