import { FC, useState } from 'react';
import { Col, Nav, Collapse } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import classnames from 'classnames';

import { loggedUserInfoStore, sideNavStore } from '@/stores';
import { Icon } from '@/components'; // 假设你的项目中已经有一个Icon组件
import './index.scss';

// 自定义 NavLink 组件
interface CustomNavLinkProps {
  to: string;
  icon?: string;
  children: React.ReactNode;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const CustomNavLink: FC<CustomNavLinkProps> = ({
  to,
  icon,
  children,
  active,
  onClick,
}) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      classnames('nav-link d-flex align-items-center custom-nav-link', {
        active: isActive || active,
      })
    }
    onClick={onClick}>
    {icon && <Icon name={icon} className="me-2 flex-shrink-0" />}
    <span className="text-truncate">{children}</span>
  </NavLink>
);

const Index: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user: userInfo } = loggedUserInfoStore();
  const { visible, can_revision, revision } = sideNavStore();

  // State to control collapsible sections
  const [interestOpen, setInterestOpen] = useState(true);
  const [functionOpen, setFunctionOpen] = useState(true);
  const [projectOpen, setProjectOpen] = useState(true);

  const handleNavClick = (e, path) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <Col
      xl={2}
      lg={3}
      md={12}
      className={classnames(
        'position-relative',
        visible ? '' : 'd-none d-lg-block',
      )}
      id="sideNav">
      <div className="nav-wrap pt-4">
        <Nav variant="pills" className="flex-column">
          <CustomNavLink
            to="/questions"
            icon="question-circle-fill"
            active={pathname === '/' || pathname === '/questions'}>
            {t('header.nav.question')}
          </CustomNavLink>

          <CustomNavLink
            to="/tags"
            icon="tags-fill"
            active={pathname === '/tags'}
            onClick={(e) => handleNavClick(e, '/tags')}>
            {t('header.nav.tag')}
          </CustomNavLink>

          <CustomNavLink to="/users" icon="people-fill">
            {t('header.nav.user')}
          </CustomNavLink>

          <CustomNavLink to="/tags/announcement" icon="megaphone-fill">
            {t('header.nav.announcement')}
          </CustomNavLink>
          {/* 常规话题 */}
          <CustomNavLink to="/tags/general" icon="sticky-fill">
            {t('header.nav.general')}
          </CustomNavLink>
          {/* 公益 */}
          <CustomNavLink to="/tags/public-good" icon="hand-thumbs-up-fill">
            {t('header.nav.public-good')}
          </CustomNavLink>

          {/* 兴趣专区 */}
          <div
            className="py-2 px-2 mt-3 small fw-bold d-flex justify-content-between align-items-center"
            onClick={() => setInterestOpen(!interestOpen)}
            style={{ cursor: 'pointer' }}>
            {t('header.nav.interest')}
            <Icon
              name="chevron-down"
              className={classnames('transition-transform', {
                'rotate-180': interestOpen,
              })}
            />
          </div>
          <Collapse in={interestOpen}>
            <div>
              {/* 游戏 */}
              <CustomNavLink to="/tags/game" icon="controller">
                {t('header.nav.game')}
              </CustomNavLink>
              {/* 音乐 */}
              <CustomNavLink to="/tags/music" icon="music-note">
                {t('header.nav.music')}
              </CustomNavLink>
              {/* 电影 */}
              <CustomNavLink to="/tags/video" icon="film">
                {t('header.nav.video')}
              </CustomNavLink>
              {/* 阅读 */}
              <CustomNavLink to="/tags/read" icon="book">
                {t('header.nav.read')}
              </CustomNavLink>
              {/* 运动 */}
              <CustomNavLink to="/tags/sports" icon="emoji-sunglasses">
                {t('header.nav.sports')}
              </CustomNavLink>
              {/* 旅游 */}
              <CustomNavLink to="/tags/travel" icon="globe-asia-australia">
                {t('header.nav.travel')}
              </CustomNavLink>
              {/* 生活 */}
              <CustomNavLink to="/tags/life" icon="house-heart">
                {t('header.nav.life')}
              </CustomNavLink>
              {/* 吃瓜 */}
              <CustomNavLink to="/tags/gossip" icon="chat-quote">
                {t('header.nav.gossip')}
              </CustomNavLink>
            </div>
          </Collapse>

          {/* 功能专区 */}
          <div
            className="py-2 px-2 mt-3 small fw-bold d-flex justify-content-between align-items-center"
            onClick={() => setFunctionOpen(!functionOpen)}
            style={{ cursor: 'pointer' }}>
            {t('header.nav.function')}
            <Icon
              name="chevron-down"
              className={classnames('transition-transform', {
                'rotate-180': functionOpen,
              })}
            />
          </div>
          <Collapse in={functionOpen}>
            <div>
              {/* IT */}
              <CustomNavLink to="/tags/it996007" icon="code-slash">
                IT
              </CustomNavLink>
              {/* 虚拟币 */}
              <CustomNavLink to="/tags/virtual-currency" icon="coin">
                {t('header.nav.virtual-currency')}
              </CustomNavLink>
              {/* 服务器 */}
              <CustomNavLink to="/tags/server" icon="hdd-stack">
                {t('header.nav.server')}
              </CustomNavLink>
              {/* 银行和货币 */}
              <CustomNavLink to="/tags/banks-money" icon="bank">
                {t('header.nav.banks-money')}
              </CustomNavLink>
              {/* 贸易与物流 */}
              <CustomNavLink to="/tags/trade-logistics" icon="buildings">
                {t('header.nav.trade-logistics')}
              </CustomNavLink>
              {/* 羊毛,交易,拼单和推广 */}
              <CustomNavLink to="/tags/wool" icon="scissors">
                {t('header.nav.wool')}
              </CustomNavLink>
              <CustomNavLink to="/tags/transaction" icon="currency-exchange">
                {t('header.nav.transaction')}
              </CustomNavLink>
              <CustomNavLink to="/tags/group-purchase" icon="cart-plus">
                {t('header.nav.group-purchase')}
              </CustomNavLink>
              <CustomNavLink to="/tags/promotion" icon="broadcast">
                {t('header.nav.promotion')}
              </CustomNavLink>
            </div>
          </Collapse>

          {/* 项目专区 */}
          <div
            className="py-2 px-2 mt-3 small fw-bold d-flex justify-content-between align-items-center"
            onClick={() => setProjectOpen(!projectOpen)}
            style={{ cursor: 'pointer' }}>
            {t('header.nav.project')}
            <Icon
              name="chevron-down"
              className={classnames('transition-transform', {
                'rotate-180': projectOpen,
              })}
            />
          </div>
          <Collapse in={projectOpen}>
            <div>
              {/* One Hub */}
              <CustomNavLink to="/tags/one-hub">One Hub</CustomNavLink>
            </div>
          </Collapse>

          <div className="mt-2 py-2 px-1  small flex-warprap">
            <hr className="mt-0 mb-2" />
            <a href="/questions/D1C2">{t('header.nav.introduction')}</a>
            <br />
            <br />
            <a href="/tos">{t('nav_menus.tos')}</a> |
            <a href="/privacy"> {t('nav_menus.privacy')}</a>
          </div>

          {can_revision || userInfo?.role_id === 2 ? (
            <>
              <div className="py-2 px-2 mt-3 small fw-bold">
                {t('header.nav.moderation')}
              </div>
              {can_revision && (
                <CustomNavLink to="/review">
                  <span>{t('header.nav.review')}</span>
                  <span className="float-end">
                    {revision > 99 ? '99+' : revision > 0 ? revision : ''}
                  </span>
                </CustomNavLink>
              )}

              {userInfo?.role_id === 2 ? (
                <CustomNavLink to="/admin">
                  {t('header.nav.admin')}
                </CustomNavLink>
              ) : null}
            </>
          ) : null}
        </Nav>
      </div>
      <div className="side-nav-right-line" />
    </Col>
  );
};

export default Index;
