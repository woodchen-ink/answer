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

import { memo, FC, useEffect, useRef } from 'react';
import { Button, Alert, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';

import {
  Actions,
  Operate,
  UserCard,
  Icon,
  Comment,
  FormatTime,
  htmlRender,
  ImgViewer,
} from '@/components';
import { scrollToElementTop, bgFadeOut } from '@/utils';
import { AnswerItem } from '@/common/interface';
import { acceptanceAnswer } from '@/services';
import { useRenderHtmlPlugin } from '@/utils/pluginKit';

interface Props {
  data: AnswerItem;
  /** router answer id */
  aid?: string;
  canAccept: boolean;
  questionTitle: string;
  isLogged: boolean;
  callback: (type: string) => void;
}
const Index: FC<Props> = ({
  aid,
  data,
  isLogged,
  questionTitle = '',
  callback,
  canAccept = false,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'question_detail',
  });
  const [searchParams] = useSearchParams();
  const answerRef = useRef<HTMLDivElement>(null);

  useRenderHtmlPlugin(answerRef);

  const acceptAnswer = () => {
    acceptanceAnswer({
      question_id: data.question_id,
      answer_id: data.accepted === 2 ? '0' : data.id,
    }).then(() => {
      callback?.('');
    });
  };

  useEffect(() => {
    if (!answerRef?.current) {
      return;
    }

    htmlRender(answerRef.current.querySelector('.fmt'));

    if (aid === data.id) {
      setTimeout(() => {
        const element = answerRef.current;
        scrollToElementTop(element);
        if (!searchParams.get('commentId')) {
          bgFadeOut(answerRef.current);
        }
      }, 100);
    }
  }, [data.id, answerRef.current]);

  if (!data?.id) {
    return null;
  }

  return (
    <div id={data.id} ref={answerRef} className="answer-item py-4">
      <div className="d-flex">
        {/* 主要内容 */}
        <div className="content-column flex-grow-1">
          {/* 用户信息和回复时间 */}
          <div className="d-flex align-items-center mb-3">
            <UserCard
              data={data?.user_info}
              time={Number(data.create_time)}
              preFix={t('answered')}
              isLogged={isLogged}
              timelinePath={`/posts/${data.question_id}/${data.id}/timeline`}
            />
          </div>

          {/* 主要内容 */}
          {data.status === 10 && (
            <Alert variant="danger" className="mb-3">
              {t('post_deleted', { keyPrefix: 'messages' })}
            </Alert>
          )}
          {data.status === 11 && (
            <Alert variant="secondary" className="mb-3">
              {t('post_pending', { keyPrefix: 'messages' })}
            </Alert>
          )}

          {data?.accepted === 2 && (
            <div className="mb-3 lh-1">
              <Badge bg="success" pill>
                <Icon name="check-circle-fill me-1" />
                {t('answers.btn_accepted')}
              </Badge>
            </div>
          )}
          <ImgViewer>
            <article
              className="fmt text-break text-wrap"
              dangerouslySetInnerHTML={{ __html: data?.html }}
            />
          </ImgViewer>

          {/* 操作按钮区域 */}
          <div className="d-flex align-items-center flex-wrap mt-4 mb-3">
            <Actions
              source="answer"
              data={{
                id: data?.id,
                isHate: data?.vote_status === 'vote_down',
                isLike: data?.vote_status === 'vote_up',
                votesCount: data?.vote_count,
                hideCollect: true,
                collected: data?.collected,
                collectCount: 0,
                username: data?.user_info?.username,
              }}
              className="me-3"
            />
            {canAccept && (
              <Button
                variant={data.accepted === 2 ? 'success' : 'outline-success'}
                onClick={acceptAnswer}
                className="me-3">
                <Icon name="check-circle-fill" className="me-2" />
                <span>
                  {data.accepted === 2
                    ? t('answers.btn_accepted')
                    : t('answers.btn_accept')}
                </span>
              </Button>
            )}
            <Operate
              qid={data.question_id}
              aid={data.id}
              memberActions={data?.member_actions}
              type="answer"
              isAccepted={data.accepted === 2}
              title={questionTitle}
              callback={callback}
              className="me-3"
            />

            {data.update_user_info &&
            data.update_user_info?.username !== data.user_info?.username ? (
              <UserCard
                data={data?.update_user_info}
                time={Number(data.update_time)}
                preFix={t('edit')}
                isLogged={isLogged}
                timelinePath={`/posts/${data.question_id}/${data.id}/timeline`}
              />
            ) : isLogged ? (
              <Link
                to={`/posts/${data.question_id}/${data.id}/timeline`}
                className="d-inline-block text-decoration-none"
                style={{ lineHeight: 1 }}>
                <FormatTime
                  time={Number(data.update_time)}
                  preFix={t('edit')}
                  className="link-secondary small p-0 line-height-21"
                />
              </Link>
            ) : (
              <FormatTime
                time={Number(data.update_time)}
                preFix={t('edit')}
                className="text-secondary small line-height-21"
              />
            )}
          </div>

          {/* 评论区 */}
          <Comment
            objectId={data.id}
            mode="answer"
            commentId={searchParams.get('commentId')}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(Index);
