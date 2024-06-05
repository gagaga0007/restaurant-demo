import { css } from '@emotion/react'
import React, { PropsWithChildren, ReactNode } from 'react'
import { Col, Row, Typography } from 'antd'

interface Props {
  title?: string
  extra?: ReactNode
}

export const BasePage = ({ title, extra, children }: PropsWithChildren<Props>) => {
  return (
    <div
      css={css`
        width: 100%;
        height: 100%;
        padding: 24px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        overflow-x: hidden;
        overflow-y: scroll;
      `}
    >
      {title || extra ? (
        <Row
          css={css`
            margin-bottom: 16px;
          `}
        >
          <Col flex="auto">
            {title ? (
              <Typography.Title
                level={2}
                css={css`
                  margin: 0;
                `}
              >
                {title}
              </Typography.Title>
            ) : null}
          </Col>
          <Col flex="none">{extra}</Col>
        </Row>
      ) : null}
      <div
        css={css`
          flex: 1;
          height: 0;
        `}
      >
        {children}
      </div>
    </div>
  )
}
