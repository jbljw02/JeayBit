# 암호화폐 가상 거래 서비스 'JeayBit'
> JeayBit은 진입장벽이 낮고 경량화된 암호화폐 가상 거래 프로그램입니다. <br>
> 기존의 응답시간이 길고 복잡한 암호화폐 거래소들과는 달리, 필수적인 기능들만을 채택하여 개발한 트레이딩 뷰입니다. <br>
> 화폐 거래는 실제 거래가 아닌 임의의 가상 환경에서 진행됩니다. <br>
  
<br>

## 1. 프로젝트 개요

### 개발 기간
> 2023.08.28 - 2023.12.05 <br>
> 2024.05.26 ~ (리팩토링)

### 인원 구성
> 이진우(1인)

### 기술

|Environment|Frontend|Backend|Database|Deployment|API|
|:---:|:---:|:---:|:---:|:---:|:---:|
|![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white) ![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)|![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)|![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white)|![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)|![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white) ![Netlify](https://img.shields.io/badge/netlify-%23000000.svg?style=for-the-badge&logo=netlify&logoColor=#00C7B7)|![aa](https://github.com/jbljw02/JeayBit/assets/125800649/f015f2eb-6b86-48e0-9722-11749244d6c3)|

<br>

## 2. 프로젝트 구조도

### 1) 화폐 정보 불러오기
![화폐 불러오기](https://github.com/user-attachments/assets/6b366b2b-4eaf-4cbb-a613-9497fc19d869)

### 2) 매수 및 매도
![화폐 거래_1](https://github.com/user-attachments/assets/22eaa2b7-5669-4a28-88e0-b547319c8236)
![화폐 거래_2](https://github.com/user-attachments/assets/938b298f-fa9b-4e5b-b9c7-6d6a1dda45ea)

<br>

## 3. 화면 구성 및 주요 기능

### 1) 회원가입
- 유효성 검사(이메일과 비밀번호의 형식)를 통과해야 회원가입이 가능합니다. <br>
- 중복된 이메일이 아니어야 합니다.

|회원가입|
|:---:|
![회원가입](https://github.com/user-attachments/assets/29212b9b-3124-46ce-8414-0c93ec486941)

### 2) 로그인
- ID와 비밀번호가 DB의 값과 일치하면 로그인에 성공합니다.
- 로그인에 성공하면 메인화면으로 이동합니다.

|로그인|
|:---:|
![로그인](https://github.com/user-attachments/assets/56e0a7f6-928d-47b2-8e94-974e04e1ff6c)

### 3) 화폐 리스트, 호가/체결내역, 차트
- 화폐의 정보는 주기적으로 갱신됩니다.
- 우측 : 화폐 리스트에서 검색/화폐 정렬 및 관심 화폐 추가가 가능하며, 선택한 화폐에 따라 다른 컴포넌트가 상호작용합니다.
- 중앙 : 선택한 화폐의 호가 내역과 체결 내역을 확인할 수 있습니다.
- 좌측 : 선택한 화폐의 시세를 보여주는 차트를 분/시간/일 단위로 확인할 수 있습니다.

|화폐 리스트, 호가/체결내역, 차트|
|:---:|
![리스트, 호가:체결내역, 차트](https://github.com/user-attachments/assets/ced386db-1592-42f4-a2ec-c46ee51ab198)

### 4) 입금 및 출금
- 사용자가 원하는 금액만큼 입금 및 출금이 가능합니다. 
- 1회의 입금 및 출금에 제한액이 있습니다.

|입금 및 출금|
|:---:|
![입금 및 출금](https://github.com/user-attachments/assets/5adbf911-22a4-4d69-8129-a6c709b38a3d)

### 5) 화폐 거래, 주문 취소
- 매수 및 매도를 할 때 호가와 일치하는 가격으로 요청하면 즉시 거래가 체결됩니다.
- 거래가 체결되면 보유 화폐의 수량이 늘어나며 거래 내역에 추가됩니다.
- (1) - 호가와 거래 요청가가 일치하지 않는다면 거래가 즉시 체결되지 않습니다. 
체결되지 않은 거래는 Celery에 의해 백그라운드에서 주기적으로 호가와 비교됩니다. 호가와 거래 요청가가 일치할 시 거래를 체결하고 웹 소켓을 통해 클라이언트에게 거래가 체결됐음을 알립니다.
- (2) - 미체결 거래는 주문 취소가 가능합니다.
매수 및 매도 내역은 '거래내역'란에서 확인할 수 있습니다.

|(1) 매수|
|:---:|
![화폐 매수](https://github.com/user-attachments/assets/fa984734-042e-4cd4-888b-081f3705c0c4)

|(2) 매도|
|:---:|
![화폐 매도](https://github.com/user-attachments/assets/a998ec53-2207-48c4-8af0-1ea1a3597139)
