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

import { memo, FC } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import classnames from 'classnames';

import { Avatar, FormatTime, Icon } from '@/components';
import { formatCount } from '@/utils';

interface Props {
  data: any;
  time?: number;
  preFix?: string;
  isLogged?: boolean;
  timelinePath?: string;
  className?: string;
  showAvatar?: boolean;
  avatarSize?: string;
  avatarClass?: string;
  showUsername?: boolean;
}

const Index: FC<Props> = ({
  data,
  time,
  preFix,
  isLogged,
  timelinePath,
  className = '',
  showAvatar = true,
  avatarSize = '40px',
  avatarClass = '',
  showUsername = true,
}) => {
  const { t } = useTranslation();
  const renderAvatar = () => {
    if (!showAvatar) return null;

    const avatarElement = (
      <Avatar
        avatar={data?.avatar}
        size={avatarSize}
        className={classnames('me-2', avatarClass)}
        searchStr={`s=${parseInt(avatarSize, 10) * 2}`}
        alt={data?.display_name}
      />
    );

    return data?.status !== 'deleted' ? (
      <Link to={`/users/${data?.username}`}>{avatarElement}</Link>
    ) : (
      avatarElement
    );
  };

  const renderUsername = () => {
    if (!showUsername) return null;

    return data?.status !== 'deleted' ? (
      <Link
        to={`/users/${data?.username}`}
        className="me-1 text-break name-ellipsis"
        style={{ maxWidth: '100px' }}>
        {data?.display_name}
      </Link>
    ) : (
      <span className="me-1 text-break">{data?.display_name}</span>
    );
  };

  return (
    <div className={classnames('d-flex', className)}>
      {renderAvatar()}
      <div className="small text-secondary d-flex flex-row flex-md-column align-items-center align-items-md-start">
        <div className="me-1 me-md-0 d-flex align-items-center">
          {renderUsername()}
          <span className="fw-bold ms-2" title={t('personal.reputation')}>
            <Icon name="trophy" className="me-1" />
            {formatCount(data?.rank)}
          </span>
        </div>
        {time &&
          (isLogged ? (
            <Link to={timelinePath || '#'}>
              <FormatTime
                time={time}
                preFix={preFix}
                className="link-secondary"
              />
            </Link>
          ) : (
            <FormatTime time={time} preFix={preFix} />
          ))}
      </div>
    </div>
  );
};

export default memo(Index);
