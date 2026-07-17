import { Link } from 'react-router-dom'
import { course } from '../data/curriculum.js'

export default function AboutPage() {
  return (
    <div className="container">
      <div className="session-head">
        <h1>About — 과정 안내</h1>
        <p className="meta">이 사이트를 만든 이유와 강사 소개</p>
      </div>

      <section className="section">
        <h2><span className="num">01</span>개발 취지</h2>
        <div className="theory-block">
          <h3>강의 흐름 그대로, 한 곳에서</h3>
          <p>{`3일 21시간은 강화학습의 기초부터 최신 알고리즘까지 달리기에 결코 긴 시간이 아닙니다.
수업 중에는 이론과 구현에 집중하고, 자료를 찾아 헤매는 시간은 없애자는 것이 이 사이트의 첫 번째 목적입니다.
멀티캠퍼스 공식 목차의 21개 교시가 순서 그대로 정리되어 있고, 각 교시마다 학습 목표 → 이론 요약 → 실행 가능한 실습 코드가 하나의 흐름으로 이어집니다.`}</p>
        </div>
        <div className="theory-block">
          <h3>코드는 복사해서 바로 실행</h3>
          <p>{`모든 실습 코드는 복사 버튼 한 번으로 가져가 로컬이나 Colab에서 바로 실행할 수 있습니다.
코드는 교시 간에 이어지도록 설계했습니다 — 1일차에 만든 GridWorld를 DP·MC·TD가 재사용하고, 2일차의 ReplayBuffer와 Critic이 3일차의 DDPG·SAC·TAC까지 이어집니다.
"이전 시간에 만든 부품으로 다음 알고리즘을 조립한다"는 감각이 강화학습 알고리즘 계보를 이해하는 가장 빠른 길이라고 믿습니다.`}</p>
        </div>
        <div className="theory-block">
          <h3>수업이 끝나도 남는 자료</h3>
          <p>{`교육 3일로 끝나지 않도록, 마지막 날 복습 퀴즈 15문항과 난이도별 도전과제 4단계, 엄선한 심화 자료 12종을 담았습니다.
진도 체크는 브라우저에만 저장되며(로그인 불필요), 이 사이트는 교육 종료 후에도 계속 공개되어 있으니 언제든 돌아와 복습하세요.`}</p>
        </div>
      </section>

      <section className="section">
        <h2><span className="num">02</span>강사 소개</h2>
        <div className="card" style={{ marginBottom: 16 }}>
          <h3>이애본 — DreamIT Biz 대표</h3>
          <p style={{ marginTop: 8 }}>
            PyTorch 딥러닝 저서를 집필했고, 대학·기업·공공기관에서 인공지능과 프로그래밍
            교육을 다수 진행해 온 현장형 강사입니다. 이론을 수식으로만 전달하기보다,
            직접 구현하고 실행 결과를 눈으로 확인하며 원리를 체득하는 수업을 지향합니다.
          </p>
        </div>
        <div className="card-grid">
          <div className="card">
            <h3>📚 주요 활동</h3>
            <ul>
              <li>PyTorch 딥러닝 저서 집필</li>
              <li>대학 AI·데이터 교육 다수 (서울대, 전남대, 명지대, 한국기술교육대, 조선대, UNIST 등)</li>
              <li>기업·기관 AI 교육 (SK SKALA, 멀티캠퍼스, KERIS, 공공기관 생성형 AI 과정 등)</li>
              <li>AI 학습 플랫폼·교육 사이트 다수 기획·개발 운영</li>
            </ul>
          </div>
          <div className="card">
            <h3>🎯 수업 철학</h3>
            <ul>
              <li>이론 한 시간, 구현 한 시간 — 배운 것은 반드시 코드로 확인</li>
              <li>알고리즘의 "계보"를 잇는 수업 — 왜 이 알고리즘이 나왔는지부터</li>
              <li>수업이 끝나도 혼자 학습을 이어갈 수 있는 로드맵 제공</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <h2><span className="num">03</span>교육 개요</h2>
        <div className="card">
          <table className="info-table">
            <tbody>
              <tr><th>교육 과정</th><td>{course.title} ({course.org})</td></tr>
              <tr><th>교육 일정</th><td>{course.period}</td></tr>
              <tr><th>교육 시간</th><td>{course.hours}</td></tr>
              <tr><th>교육 장소</th><td>{course.place}</td></tr>
              <tr>
                <th>과정 페이지</th>
                <td><a href={course.homepage} target="_blank" rel="noreferrer" style={{ color: 'var(--blue)' }}>멀티캠퍼스 과정 소개 바로가기 ↗</a></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="objectives" style={{ marginTop: 20 }}>
          <h4>💡 수강 전 준비</h4>
          <ul>
            <li><Link to="/prereq" style={{ color: 'var(--accent)', fontWeight: 700 }}>선수학습 페이지</Link>에서 필요한 사전 지식을 셀프체크해 보세요</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
