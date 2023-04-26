let isDebugEnabled = process.env.NEXT_PUBLIC_LOGDEBUG || false;

const logDebug = (...args: any[]) => {
    if (!isDebugEnabled) {
        return;
    }

    // Only add the styled prefix in a browser context.
    const prefix =
        typeof window !== 'undefined'
            ? [
                  '%cD-law CLient:: ',
                  'background: #ffa000; color: #fff; border-radius: 2px; padding: 2px 6px',
              ]
            : ['D-law Server::'];

    // eslint-disable-next-line no-console
    console.log(...prefix, ...args);
};

export default logDebug;
