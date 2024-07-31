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

import { memo, FC, useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

import {
  Tag,
  Actions,
  Operate,
  UserCard,
  Comment,
  FormatTime,
  htmlRender,
  Icon,
  ImgViewer,
} from '@/components';
import { useRenderHtmlPlugin } from '@/utils/pluginKit';
import { formatCount, guard } from '@/utils';
import { following } from '@/services';
import { pathFactory } from '@/router/pathFactory';

interface Props {
  data: any;
  hasAnswer: boolean;
  isLogged: boolean;
  initPage: (type: string) => void;
}

const Index: FC<Props> = ({ data, initPage, hasAnswer, isLogged }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'question_detail',
  });
  const [searchParams] = useSearchParams();
  const [followed, setFollowed] = useState(data?.is_followed);
  const ref = useRef<HTMLDivElement>(null);

  useRenderHtmlPlugin(ref.current);

  const handleFollow = (e) => {
    e.preventDefault();
    if (!guard.tryNormalLogged(true)) {
      return;
    }
    following({
      object_id: data?.id,
      is_cancel: followed,
    }).then((res) => {
      setFollowed(res.is_followed);
    });
  };

  useEffect(() => {
    if (data) {
      setFollowed(data?.is_followed);
    }
  }, [data]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    htmlRender(ref.current);
  }, [ref.current]);

  if (!data?.id) {
    return null;
  }

  return (
    <div>
      <h1 className="h3 mb-3 text-wrap text-break">
        {data?.pin === 2 && (
          <Icon
            name="pin-fill"
            className="me-1"
            title={t('pinned', { keyPrefix: 'btns' })}
          />
        )}
        <Link
          className="link-dark"
          reloadDocument
          to={pathFactory.questionLanding(data.id, data.url_title)}>
          {data.title}
          {data.status === 2
            ? ` [${t('closed', { keyPrefix: 'question' })}]`
            : ''}
        </Link>
      </h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <UserCard
          data={data?.user_info}
          time={data.create_time}
          preFix={t('asked')}
          isLogged={isLogged}
          timelinePath={`/posts/${data.id}/timeline`}
        />
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip id="followTooltip">{t('follow_tip')}</Tooltip>}>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={(e) => handleFollow(e)}>
            {t(followed ? 'Following' : 'Follow')}
          </Button>
        </OverlayTrigger>
      </div>

      <div className="d-flex flex-wrap align-items-center small mb-3 text-secondary">
        {data?.tags?.map((item: any) => {
          return <Tag className="me-1" key={item.slug_name} data={item} />;
        })}
        {/* <FormatTime
          time={data.create_time}
          preFix={t('Asked')}
          className="me-3"
        /> */}
        <FormatTime
          time={data.update_time}
          preFix={t('update')}
          className="ms-2 me-3"
        />
        {data?.view_count > 0 && (
          <div className="me-3">
            {t('Views')} {formatCount(data.view_count)}
          </div>
        )}
      </div>

      <ImgViewer>
        <article
          ref={ref}
          className="fmt text-break text-wrap mt-3"
          dangerouslySetInnerHTML={{ __html: data?.html }}
        />
      </ImgViewer>

      <div className="d-flex  align-items-center flex-wrap mt-4 mb-3">
        <Actions
          source="question"
          data={{
            id: data?.id,
            isHate: data?.vote_status === 'vote_down',
            isLike: data?.vote_status === 'vote_up',
            votesCount: data?.vote_count,
            collected: data?.collected,
            collectCount: data?.collection_count,
            username: data.user_info?.username,
          }}
          className="me-3"
        />
        <Operate
          qid={data?.id}
          type="question"
          memberActions={data?.member_actions}
          title={data.title}
          hasAnswer={hasAnswer}
          isAccepted={Boolean(data?.accepted_answer_id)}
          callback={initPage}
          className="me-3"
        />
        {data.update_user_info &&
        data.update_user_info?.username !== data.user_info?.username ? (
          <UserCard
            data={data?.update_user_info}
            time={data.edit_time}
            preFix={t('edit')}
            isLogged={isLogged}
            timelinePath={`/posts/${data.id}/timeline`}
          />
        ) : isLogged ? (
          <Link to={`/posts/${data.id}/timeline`} style={{ lineHeight: 1 }}>
            <FormatTime
              time={data.edit_time}
              preFix={t('edit')}
              className="link-secondary small p-0 line-height-21"
            />
          </Link>
        ) : (
          <FormatTime
            time={data.edit_time}
            preFix={t('edit')}
            className="text-secondary small line-height-21"
          />
        )}
      </div>

      <Comment
        objectId={data?.id}
        mode="question"
        commentId={searchParams.get('commentId')}
      />
    </div>
  );
};

export default memo(Index);
