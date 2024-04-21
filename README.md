# 🔒OAuth

<p>
  <a href="#kakao-oauth"><img src="https://img.shields.io/badge/Kakao-FEE500?style=for-the-badge"></a>
  <a href="#naver-oauth"><img src="https://img.shields.io/badge/Naver-03C75A?style=for-the-badge"></a>
  <a href="#google-oauth"><img src="https://img.shields.io/badge/Google-4285F4?style=for-the-badge"></a>
</p>

https://github.com/do0ori/login-with-OAuth/assets/71831926/606503b1-0e98-4db8-aa47-731b479fba3c

## 🟨[Kakao OAuth](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api)

### Kakao Developers 사전 작업

1. https://developers.kakao.com/console/app > 애플리케이션 추가하기
2. 애플리케이션 선택
3. 내 애플리케이션 > 앱 설정 > 요약 정보
   - 앱 키 > **_REST API 키_** (인가 코드 요청 시 필요)
4. 플랫폼 > 플랫폼 설정하기 > Web > **_사이트 도메인_**: https://localhost:3000
5. Redirect URI 등록하러 가기
   - 활성화 설정: ON
   - Redirect URI 등록 > **_Redirect URI_**: http://localhost:3001/api/auth/kakao/callback
6. 내 애플리케이션 > 제품 설정 > 카카오 로그인 > 보안 > **_Client Secret_** > 코드 생성 (선택)
   - 활성화 상태: 사용함
7. 내 애플리케이션 > 제품 설정 > 카카오 로그인 > 동의항목

   - 닉네임
   - 프로필 사진
   - 카카오계정(이메일) 설정 👈 **비즈앱**으로 전환해야 동의항목 설정이 가능하다.

   추후 인가 코드를 받을 때 [scope](https://developers.kakao.com/docs/latest/ko/kakaologin/common#user-info-kakao-account)와 관련 있다.

### Diagram

<details>
<summary>Kakao Developers에서 제공하는 카카오 로그인 과정을 나타낸 시퀀스 다이어그램</summary>
<img src="https://developers.kakao.com/docs/latest/ko/assets/style/images/kakaologin/kakaologin_sequence.png">

- Server에서 Kakao Auth Server로 인가 코드 받기 요청을 보내면 Client에 카카오계정 로그인 화면이 뜨지 않는다. Server에서 요청을 보냈기 때문에 어쩌면 당연하다. 이를 해결하기 위해 서버에서 인가 코드 받기 URL로 redirect를 시켜보려고 했으나 프론트엔드와 백엔드의 port가 달라 CORS 오류가 발생했고 결국 해결하지 못했다. 그래서 처음에는 Client에서 직접 Kakao Auth Server로 코드 받기 요청을 보내도록 했다. [추가로 찾아보니 CORS 오류는 Ajax 방식으로 요청한 경우 발생하고 a 태그로 이동해야 한다고 한다.](https://devtalk.kakao.com/t/topic/126926) a 태그로 서버에 요청을 보내고 서버에서 다시 redirect를 하니 정상적으로 동작했다.
- REDIRECT_URI를 server api로 설정했을 때 client도 해당 URI로 이동하는 이슈가 있었는데 server에서 redirect하도록 해서 해결했다.
</details>

![Kakao-OAuth drawio](https://github.com/do0ori/login-with-OAuth/assets/71831926/81719c79-5ec6-4145-bb1f-1f69e884018b)

## 🟩[Naver OAuth](https://developers.naver.com/docs/login/web/web.md)

### [Naver Developers 사전 작업](https://developers.naver.com/docs/common/openapiguide/appregister.md#%EC%95%A0%ED%94%8C%EB%A6%AC%EC%BC%80%EC%9D%B4%EC%85%98-%EB%93%B1%EB%A1%9D)

1. https://developers.naver.com/apps/#/wizard/register > 약관동의 > 계정 정보 등록 > 애플리케이션 등록
   - 사용 API: 네이버 로그인
     - 권한: 회원이름, 연락처 이메일 주소, 별명, 프로필 사진 ✔️
   - 로그인 오픈 API 서비스 환경: PC 웹
     - **_서비스 URL_**: http://localhost:3000
     - 네이버 로그인 **_Callback URL_**: http://localhost:3001/api/auth/naver/callback
2. 내 애플리케이션 > 개요
   - 애플리케이션 정보
     - **_Client ID_**
     - **_Client Secret_**
   - 네이버 로그인
     - 개발 상태 (개발 중)
       > 애플리케이션이 ‘개발 중‘ 상태이면 [멤버관리] 탭에서 등록한 아이디만 네이버 로그인을 이용할 수 있습니다. 개발이 완료되어 실 서비스에 적용하고자 하신다면 검수를 요청해 주세요. 검수가 승인되면 모든 아이디로 네이버 로그인을 이용할 수 있습니다.
3. 내 애플리케이션 > 멤버관리 (애플리케이션 개설자는 등록할 필요가 없다.)
   - 관리자 ID 등록
   - 테스터 ID 등록

### Diagram

![Naver-OAuth drawio](https://github.com/do0ori/login-with-OAuth/assets/71831926/84b28652-7335-416d-b2ea-77e00c95c2b5)

## 🟦[Google OAuth](https://developers.google.com/identity/protocols/oauth2/web-server?hl=ko)

### Google Cloud Console 사전 작업

1. https://console.cloud.google.com > 프로젝트 선택 > 새 프로젝트
2. 왼쪽 탐색 메뉴 > API 및 서비스
   1. OAuth 동의 화면 > User Type: 외부 > 만들기
      - OAuth 동의 화면 (그냥 넘어가도 되는 듯)
        - 앱 도메인 > **_애플리케이션 홈페이지_**: http://localhost:3000
      - 범위 (추후 인가 코드 발급 시 scope에 사용됨)
        - 범위 추가 또는 삭제 > email, profile ✔️ > 업데이트
      - 테스트 사용자
        - 본인 메일 추가
   2. 사용자 인증 정보 > 사용자 인증 정보 만들기 > OAuth 클라이언트 ID
      - 애플리케이션 유형: 웹 애플리케이션
      - **_승인된 자바스크립트 원본_**: http://localhost:3000
      - **_승인된 리디렉션 URI_**: http://localhost:3001/api/auth/google/callback
   3. 사용자 인증 정보 > OAuth 2.0 클라이언트 ID > 방금 만든 웹 클라이언트 클릭
      - **_클라이언트 ID_**
      - **_클라이언트 보안 비밀번호_**

### Diagram

![Google-OAuth drawio](https://github.com/do0ori/login-with-OAuth/assets/71831926/6607c08b-3469-4581-8d50-997f2a213cea)

## 기술 스택

<p>
  <img src="https://img.shields.io/badge/Create%20React%20App-09D3AC?style=for-the-badge&logo=Create%20React%20App&logoColor=white">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=NestJS&logoColor=white">
  <!-- <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=Prisma&logoColor=white">
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white"> -->
</p>
