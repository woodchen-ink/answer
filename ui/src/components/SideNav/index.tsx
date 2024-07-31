/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { FC } from 'react';
import { Col, Nav } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import classnames from 'classnames';

import { loggedUserInfoStore, sideNavStore } from '@/stores';
import { Icon } from '@/components';
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
      classnames('nav-link d-flex align-items-center', {
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

          {/* 快捷链接 */}
          <div className="py-2 px-3 mt-3 small fw-bold">
            {t('header.nav.quicklinks')}
          </div>
          <CustomNavLink to="/tags/help" icon="life-preserver">
            {t('header.nav.help')}
          </CustomNavLink>
          <CustomNavLink to="/tags/information-sharing" icon="share-fill">
            {t('header.nav.information-sharing')}
          </CustomNavLink>
          <CustomNavLink to="/tags/resource-sharing" icon="folder-symlink-fill">
            {t('header.nav.resource-sharing')}
          </CustomNavLink>
          <CustomNavLink to="/tags/just-talk" icon="chat-heart-fill">
            {t('header.nav.just-talk')}
          </CustomNavLink>

          {/* 专区 */}
          <div className="py-2 px-3 mt-3 small fw-bold">
            {t('header.nav.prefecture')}
          </div>
          <CustomNavLink to="/tags/it996007" icon="code-slash">
            {t('header.nav.it')}
          </CustomNavLink>
          <CustomNavLink to="/tags/virtual-currency" icon="coin">
            {t('header.nav.virtual-currency')}
          </CustomNavLink>
          <CustomNavLink to="/tags/server" icon="hdd-stack">
            {t('header.nav.server')}
          </CustomNavLink>
          <CustomNavLink to="/tags/game" icon="controller">
            {t('header.nav.game')}
          </CustomNavLink>
          <CustomNavLink to="/tags/music" icon="music-note">
            {t('header.nav.music')}
          </CustomNavLink>
          <CustomNavLink to="/tags/banks-money" icon="bank">
            {t('header.nav.banks-money')}
          </CustomNavLink>
          <CustomNavLink to="/tags/trade-logistics" icon="buildings">
            {t('header.nav.trade-logistics')}
          </CustomNavLink>

          <div className="py-2 px-3  small">
            <hr />
            <a href="/tos">{t('nav_menus.tos')}</a> |{' '}
            <a href="/privacy">{t('nav_menus.privacy')}</a>
          </div>

          {can_revision || userInfo?.role_id === 2 ? (
            <>
              <div className="py-2 px-3 mt-3 small fw-bold">
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
