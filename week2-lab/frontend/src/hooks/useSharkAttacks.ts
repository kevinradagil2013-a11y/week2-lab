import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  catchError,
  defer,
  finalize,
  from,
  map,
  of,
} from 'rxjs';

import {
  getSharkAttacks,
} from '../services/sharkAttackApi';

import type {
  SharkAttack,
} from '../types/sharkAttack';

type UseSharkAttacksResult = {
  sharkAttacks: SharkAttack[];
  loading: boolean;
  error: string | null;
  reload: () => void;
};

export function useSharkAttacks():
  UseSharkAttacksResult {
  const [sharkAttacks, setSharkAttacks] =
    useState<SharkAttack[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadSharkAttacks =
    useCallback(() => {
      setLoading(true);
      setError(null);

      const subscription =
        defer(() =>
          from(getSharkAttacks()),
        )
          .pipe(
            map((data) => data),

            catchError((requestError) => {
              const message =
                requestError instanceof Error
                  ? requestError.message
                  : 'Unable to load shark attacks';

              setError(message);

              return of([]);
            }),

            finalize(() => {
              setLoading(false);
            }),
          )
          .subscribe((data) => {
            setSharkAttacks(data);
          });

      return subscription;
    }, []);

  useEffect(() => {
    const subscription =
      loadSharkAttacks();

    return () => {
      subscription.unsubscribe();
    };
  }, [loadSharkAttacks]);

  return {
    sharkAttacks,
    loading,
    error,
    reload: loadSharkAttacks,
  };
}