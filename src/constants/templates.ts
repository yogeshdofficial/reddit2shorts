export const commentTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body style="padding:10px">
    <div style="display: flex; flex-direction: column; gap: 0px; width: 680px;border-radius:4px">
      <div style="display: flex; align-items: center; gap: 8px">
        <img
          src="%avatar%"
          alt="alt"
          style="
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 1px solid black;
          "
        />
        <div style="display: flex; gap: 4px; align-items: center">
          <div
            style="
              color: #181411;
              font-size: 14px;
              font-weight: 700;
              line-height: 16px;
            "
          >
            %username%
          </div>
          <div
            style="
              width: 2px;
              height: 2px;
              border-radius: 50%;
              background-color: black;
            "
          ></div>
          <div style="color: #71655a; font-size: 14px; list-style: 16px">
            %time%
          </div>
        </div>
      </div>
      <div style="color: #333d42; font-size: 16px; line-height: 20px">
        %body%
      </div>
      <div
        style="display: flex; gap: 16px; align-items: center; font-size: 14px"
      >
        <div style="display: flex; gap: 4px">
          <svg
            fill="gray"
            width="18px"
            height="18px"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10zM15 12h-1v8h-4v-8H6.081L12 4.601 17.919 12H15z"
            />
          </svg>
          <span style="color: gray; font-weight: bold">%upvotes%</span>
          <svg
            style="transform: scale(1, -1)"
            fill="gray"
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10zM15 12h-1v8h-4v-8H6.081L12 4.601 17.919 12H15z"
            />
          </svg>
        </div>
        <div
          style="
            display: flex;
            gap: 4px;
            align-items: center;
            margin-bottom: 4px;
          "
        >
          <svg
            rpl=""
            aria-hidden="true"
            fill="gray"
            height="18"
            icon-name="award-outline"
            viewBox="0 0 20 20"
            width="18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!--?lit$237301612$--><!--?lit$237301612$-->
            <path
              d="m18.66 15.36-2.593-3.885A6.997 6.997 0 1 0 3 8c0 1.22.322 2.42.932 3.476l-2.582 3.87a.961.961 0 0 0-.05 1.017c.168.315.525.51.88.483l2.177-.087.741 1.993c.108.333.41.59.756.64a.994.994 0 0 0 .947-.422l2.67-3.997c.35.026.708.026 1.059 0l2.678 4.01a.98.98 0 0 0 .794.418c.388 0 .761-.255.889-.621l.75-2.022 2.155.086a.976.976 0 0 0 .903-.481.955.955 0 0 0-.039-1.003ZM6.143 17.256c-.208-.557-.343-1.488-.871-1.85-.543-.37-1.485-.126-2.092-.101l1.7-2.547a7.009 7.009 0 0 0 2.992 1.909l-1.73 2.589ZM4.5 8a5.5 5.5 0 1 1 5.5 5.5A5.507 5.507 0 0 1 4.5 8Zm10.241 7.393c-.54.354-.675 1.302-.883 1.863l-1.73-2.59a7.007 7.007 0 0 0 2.992-1.908l1.7 2.547c-.601-.024-1.537-.268-2.079.088Z"
            ></path>
            <!--?-->
          </svg>
          <span style="color: gray; font-weight: bold">award</span>
        </div>
        <div
          style="
            display: flex;
            gap: 4px;
            align-items: center;
            margin-bottom: 4px;
          "
        >
          <svg
            rpl=""
            aria-hidden="true"
            class="icon-share"
            fill="gray"
            height="18"
            icon-name="share-new-outline"
            viewBox="0 0 20 20"
            width="18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.239 18.723A1.235 1.235 0 0 1 1 17.488C1 11.5 4.821 6.91 10 6.505V3.616a1.646 1.646 0 0 1 2.812-1.16l6.9 6.952a.841.841 0 0 1 0 1.186l-6.9 6.852A1.645 1.645 0 0 1 10 16.284v-2.76c-2.573.243-3.961 1.738-5.547 3.445-.437.47-.881.949-1.356 1.407-.23.223-.538.348-.858.347ZM10.75 7.976c-4.509 0-7.954 3.762-8.228 8.855.285-.292.559-.59.832-.883C5.16 14 7.028 11.99 10.75 11.99h.75v4.294a.132.132 0 0 0 .09.134.136.136 0 0 0 .158-.032L18.186 10l-6.438-6.486a.135.135 0 0 0-.158-.032.134.134 0 0 0-.09.134v4.36h-.75Z"
            ></path>
          </svg>
          <span style="color: gray; font-weight: bold">award</span>
        </div>
      </div>
    </div>
  </body>
</html>
`;
export const postTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div style="display: flex; flex-direction: column; gap: 16px; width: 680px;padding:10px;border-radius:4px">
      <div style="display: flex; align-items: center; gap: 8px">
        <img
          src="%avatar%"
          alt="alt"
          style="
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 1px solid black;
          "
        />
        <div>
          <div style="display: flex; gap: 4px; align-items: center">
            <div
              style="
                color: #181411;
                font-size: 14px;
                font-weight: 700;
                line-height: 16px;
              "
            >
              r/%subreddit%
            </div>
            <div
              style="
                width: 2px;
                height: 2px;
                border-radius: 50%;
                background-color: #71655a;
              "
            ></div>
            <div style="color: #71655a; font-size: 14px; line-height: 16px">
              %time%
            </div>
          </div>
          <div style="color: #333d42; font-size: 14px; line-height: 16px">
            %username%
          </div>
        </div>
      </div>
      <div style="color: #333d42; font-weight: bold; line-height: 20px">
        %body%
      </div>
      <div
        style="display: flex; gap: 16px; align-items: center; font-size: 14px"
      >
        <div style="display: flex; gap: 4px">
          <svg
            fill="gray"
            width="18px"
            height="18px"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10zM15 12h-1v8h-4v-8H6.081L12 4.601 17.919 12H15z"
            />
          </svg>
          <span style="color: gray; font-weight: bold">%upvotes%</span>
          <svg
            style="transform: scale(1, -1)"
            fill="gray"
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10zM15 12h-1v8h-4v-8H6.081L12 4.601 17.919 12H15z"
            />
          </svg>
        </div>
        <div
          style="
            display: flex;
            gap: 4px;
            align-items: center;
            margin-bottom: 4px;
          "
        >
          <svg
            rpl=""
            aria-hidden="true"
            class="icon-comment"
            fill="gray"
            height="16"
            icon-name="comment-outline"
            viewBox="0 0 20 20"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!--?lit$85978332$--><!--?lit$85978332$-->
            <path
              d="M10 19H1.871a.886.886 0 0 1-.798-.52.886.886 0 0 1 .158-.941L3.1 15.771A9 9 0 1 1 10 19Zm-6.549-1.5H10a7.5 7.5 0 1 0-5.323-2.219l.54.545L3.451 17.5Z"
            ></path>
            <!--?-->
          </svg>
          <span style="color: gray; font-weight: bold">%comments%</span>
        </div>
        <div
          style="
            display: flex;
            gap: 4px;
            align-items: center;
            margin-bottom: 4px;
          "
        >
          <svg
            rpl=""
            aria-hidden="true"
            fill="gray"
            height="18"
            icon-name="award-outline"
            viewBox="0 0 20 20"
            width="18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!--?lit$237301612$--><!--?lit$237301612$-->
            <path
              d="m18.66 15.36-2.593-3.885A6.997 6.997 0 1 0 3 8c0 1.22.322 2.42.932 3.476l-2.582 3.87a.961.961 0 0 0-.05 1.017c.168.315.525.51.88.483l2.177-.087.741 1.993c.108.333.41.59.756.64a.994.994 0 0 0 .947-.422l2.67-3.997c.35.026.708.026 1.059 0l2.678 4.01a.98.98 0 0 0 .794.418c.388 0 .761-.255.889-.621l.75-2.022 2.155.086a.976.976 0 0 0 .903-.481.955.955 0 0 0-.039-1.003ZM6.143 17.256c-.208-.557-.343-1.488-.871-1.85-.543-.37-1.485-.126-2.092-.101l1.7-2.547a7.009 7.009 0 0 0 2.992 1.909l-1.73 2.589ZM4.5 8a5.5 5.5 0 1 1 5.5 5.5A5.507 5.507 0 0 1 4.5 8Zm10.241 7.393c-.54.354-.675 1.302-.883 1.863l-1.73-2.59a7.007 7.007 0 0 0 2.992-1.908l1.7 2.547c-.601-.024-1.537-.268-2.079.088Z"
            ></path>
            <!--?-->
          </svg>
          <span style="color: gray; font-weight: bold">award</span>
        </div>
        <div
          style="
            display: flex;
            gap: 4px;
            align-items: center;
            margin-bottom: 4px;
          "
        >
          <svg
            rpl=""
            aria-hidden="true"
            class="icon-share"
            fill="gray"
            height="18"
            icon-name="share-new-outline"
            viewBox="0 0 20 20"
            width="18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.239 18.723A1.235 1.235 0 0 1 1 17.488C1 11.5 4.821 6.91 10 6.505V3.616a1.646 1.646 0 0 1 2.812-1.16l6.9 6.952a.841.841 0 0 1 0 1.186l-6.9 6.852A1.645 1.645 0 0 1 10 16.284v-2.76c-2.573.243-3.961 1.738-5.547 3.445-.437.47-.881.949-1.356 1.407-.23.223-.538.348-.858.347ZM10.75 7.976c-4.509 0-7.954 3.762-8.228 8.855.285-.292.559-.59.832-.883C5.16 14 7.028 11.99 10.75 11.99h.75v4.294a.132.132 0 0 0 .09.134.136.136 0 0 0 .158-.032L18.186 10l-6.438-6.486a.135.135 0 0 0-.158-.032.134.134 0 0 0-.09.134v4.36h-.75Z"
            ></path>
          </svg>
          <span style="color: gray; font-weight: bold">share</span>
        </div>
      </div>
    </div>
  </body>
</html>
`;
