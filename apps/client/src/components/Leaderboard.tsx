import { useEffect, useState } from 'react';

import { socket } from '../common/socket';

type LeaderboardEntry = [string, number];

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    socket.emit('leaderboard');
    const onUpdate = (leaderboard: LeaderboardEntry[]) => {
      setLeaderboard(leaderboard);
    };
    socket.on('leaderboard', onUpdate);
    return () => {
      socket.off('leaderboard', onUpdate);
    };
  }, []);

  return (
    <div className="min-h-[180px] flex flex-col gap-5 my-6">
      {leaderboard.length > 0 && (
        <div className="flex flex-col items-center gap-1">
          <img className="w-14 h-14" src="/assets/king.svg" />
          <div className="flex flex-col items-center text-sm">
            <span>{leaderboard[0][0]}</span>
            <span>Score: {leaderboard[0][1]}</span>
          </div>
        </div>
      )}
      <div className="flex justify-center gap-24">
        {leaderboard.length > 1 && (
          <div className="flex flex-col items-center gap-1">
            <img className="w-14 h-14" src="/assets/king.svg" />
            <div className="flex flex-col items-center text-sm">
              <span>{leaderboard[1][0]}</span>
              <span>Score: {leaderboard[1][1]}</span>
            </div>
          </div>
        )}
        {leaderboard.length > 2 && (
          <div className="flex flex-col items-center gap-1">
            <img className="w-14 h-14" src="/assets/king.svg" />
            <div className="flex flex-col items-center text-sm">
              <span>{leaderboard[2][0]}</span>
              <span>Score: {leaderboard[2][1]}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
