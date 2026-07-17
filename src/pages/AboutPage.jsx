// ============================================================
// About (/about): 개발취지 3단락 + 강사소개 + 교육개요 표
// ------------------------------------------------------------
// 강사소개는 skala.dreamitbiz.com/about/instructor 내용 기준
// (2026-07-17 대표 지정). 프로필 사진은 public/aebon.jpeg —
// SKALA 리포에서 복사해 온 파일. 경력·전문분야를 수정할 일이
// 생기면 SKALA 쪽 InstructorIntro.jsx와 함께 맞춰줄 것.
// ============================================================
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

        {/* 프로필 헤더 + 핵심 정보 */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
            <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <img
                src={`${import.meta.env.BASE_URL}aebon.jpeg`}
                alt="이애본 박사"
                width={150}
                height={150}
                style={{
                  width: 150, height: 150, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top',
                  border: '3px solid var(--border)', boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                }}
              />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text)' }}>이애본</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 700, marginTop: 2 }}>Ph.D Aebon Lee</div>
              </div>
            </div>
            <div style={{ flex: '1 1 300px' }}>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', lineHeight: 1.9, marginTop: 4 }}>
                생성형 인공지능 교육과 에듀테크 플랫폼 개발을 전문으로 하는 강사입니다.
                120여 개의 교육 사이트를 직접 설계·개발·운영하고 있습니다.
                대학교(경기대·한신대·한국기술교육대·전남대·서울대·한국외대 등)와
                기업·공공기관에서 AI 활용 교육을 진행하고 있습니다.
              </p>
            </div>
            <div style={{ flex: '1 1 300px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                ['직위', '드림아이티비즈 대표'],
                ['학위', '정보관리박사 (Ph.D)'],
                ['전공', '컴퓨터 / 직업학 / 정보관리'],
                ['교육 사이트', '120여 개 직접 개발·운영'],
                ['교육 대상', '대학 · 기업 · 공공기관'],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: '9px 12px', background: 'var(--bg-soft)', borderRadius: 8, fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>{k}</span>
                  <div style={{ color: 'var(--text)', fontWeight: 800, marginTop: 2 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 전문 분야 */}
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '24px 0 12px' }}>전문 분야</h3>
        <div className="card-grid">
          {[
            { area: '생성형 AI 교육', detail: 'ChatGPT, Gemini, Claude, Copilot 등 AI 도구 활용 교육' },
            { area: '딥러닝 · 강화학습', detail: 'PyTorch 기반 딥러닝·강화학습 이론과 구현 교육' },
            { area: '프롬프트 엔지니어링', detail: 'SCORE 프레임워크, Chain-of-Thought, Few-shot 등 고급 기법' },
            { area: '에듀테크 플랫폼', detail: 'React + Supabase 기반 교육 사이트 설계·개발·운영' },
            { area: '대학 교육', detail: 'AI·SW개론, 컴퓨팅 사고, 파이썬 프로그래밍 등 대학 교과목 강의' },
            { area: '출판 · 콘텐츠', detail: 'AI·IT·경영 분야 전문 도서 기획·출판' },
          ].map((e) => (
            <div key={e.area} className="card" style={{ padding: '16px 18px' }}>
              <h3 style={{ fontSize: '0.95rem' }}>{e.area}</h3>
              <p style={{ fontSize: '0.85rem' }}>{e.detail}</p>
            </div>
          ))}
        </div>

        {/* 주요 경력 */}
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '24px 0 12px' }}>주요 경력</h3>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {[
            { period: '현재', role: '드림아이티비즈(DreamIT Biz) 대표', detail: '에듀테크 전문 기업 경영, 120여 개 교육 사이트 운영' },
            { period: '현재', role: '한신대학교 AI·SW대학 겸임교수', detail: 'AI·SW개론, 공학설계입문, 자바프로그래밍, 웹프로그래밍 담당' },
            { period: '현재', role: '한국기술교육대학교 외래교수', detail: '"컴퓨팅 사고" 교과목 담당' },
            { period: '2018~2023', role: '경기대학교 겸임교수', detail: '소프트웨어 기초 및 파이썬 프로그래밍, Warm-Up 과정 담당' },
            { period: '2001~', role: '기업 AI 교육 전문 강사', detail: '고용노동부 직업능력개발훈련교사 — 정보통신분야 인공지능, 프로그래밍 개발, UI/UX디자인 외 다수' },
          ].map((c, i, arr) => (
            <div
              key={i}
              style={{
                display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'baseline',
                padding: '14px 18px', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <span style={{ flex: '0 0 92px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent)' }}>{c.period}</span>
              <span style={{ flex: '1 1 220px', fontSize: '0.92rem', fontWeight: 800, color: 'var(--text)' }}>{c.role}</span>
              <span style={{ flex: '2 1 320px', fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>{c.detail}</span>
            </div>
          ))}
        </div>

        {/* 교육 철학 */}
        <div className="card" style={{ marginTop: 24, background: '#141a26', border: '1px solid #2d3646' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: 1 }}>TEACHING PHILOSOPHY</div>
          <p style={{ marginTop: 8, fontWeight: 900, fontSize: '1.15rem', color: '#e6edf3' }}>
            "AI는 도구이고, 진짜 혁신은 사람이 만듭니다."
          </p>
          <p style={{ marginTop: 8, fontSize: '0.9rem', lineHeight: 1.9, color: 'rgba(230,237,243,0.82)' }}>
            교육의 핵심은 기술을 '아는 것'이 아니라 '할 수 있는 것'으로 만드는 데 있습니다.
            이론 30% · 실습 70% 구성으로 교육 현장에서 바로 적용할 수 있는 실무 역량을 키웁니다.
            교육이 끝난 뒤에도 이 플랫폼에서 학습이 계속 이어지도록 함께 운영합니다.
          </p>
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
