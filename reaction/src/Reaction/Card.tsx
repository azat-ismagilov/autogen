import React from 'react';
import { BORDER_RADIUS, FONT_COLOR, FONT_FAMILY } from './constants';
import { Img } from 'remotion';
import "@fontsource/urbanist/700.css";

const card: React.CSSProperties = {
  borderRadius: BORDER_RADIUS,
  width: '100%',
  paddingTop: 30, 
  paddingBottom: 30, 
  paddingLeft: 40, 
  overflow: 'hidden',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  gap: 75,
  display: 'inline-flex'
};

const insideAlign: React.CSSProperties = {
  alignSelf: 'stretch',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  gap: 31,
  display: 'inline-flex',
}

const title: React.CSSProperties = {
  fontFamily: FONT_FAMILY,
  color: FONT_COLOR,
  fontWeight: '700',
  fontSize: '63pt',
  lineHeight: '63pt',
  textTransform: 'uppercase',
  width: 460,
};

const icon: React.CSSProperties = {
  width: 150,
  height: 150,
};

const task: React.CSSProperties = {
  fontFamily: FONT_FAMILY,
  color: FONT_COLOR,
  fontWeight: '700',
  fontSize: '277px',
  textTransform: 'uppercase',
};

const teamText: React.CSSProperties = {
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  gap: 16,
  display: 'inline-flex',
};

const additionalTeamInfo: React.CSSProperties = {
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  gap: 17,
  display: 'inline-flex',
};

const hashtagStyle: React.CSSProperties = {
  fontFamily: FONT_FAMILY,
  color: FONT_COLOR,
  fontSize: 40,
  fontWeight: '400',
};

const subtitleStyle: React.CSSProperties = {
  ...hashtagStyle,
  opacity: 0.5,
};

export const Card: React.FC<{
  text: string;
  color: string;
}> = ({ text, color }) => {
  return (
    <div style={{ ...card, background: color }}>
      <div style={insideAlign}>
        <Img src="https://en.snu.ac.kr/webdata/uploads/kor/image/2019/12/index-topbanner-symbol_sm.png" style={icon} />
        <div style={teamText}>
          <div style={title}>{text}</div>
          <div style={additionalTeamInfo}>
            <div style={hashtagStyle}>#SNU</div>
            <div style={subtitleStyle}>Cafe Mountain</div>
          </div>
        </div>
      </div>
        <div style={task}>C</div>
    </div>
  );
};


