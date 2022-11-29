import './style.scss'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { uniqueNamesGenerator, starWars } from 'unique-names-generator'
import { ReactComponent as HelmetSvg } from './helmet.svg'
import { useInView } from './observer'
import { debounce, randomInt } from './utils'

enum Color {
  RED,
  GREEN,
  BLUE,
}

interface User {
  color: Color
  name: string
  speed: number
  time: number
}

const colorsLength: number = Object.keys(Color).length / 2

const randColor = (): Color => randomInt(0, colorsLength)

interface DashboardProps {
  length?: number
}
export default function Dashboard({
  //
  length = 50,
}: DashboardProps) {
  const [users, setUsers] = useState<User[]>([])
  const [active, setActive] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [offset, setOffset] = useState<number>(0)

  const mockData = useCallback(
    (offset?: number) => {
      setLoading(true)
      setOffset((prev) => prev + length)
      const data = Array.from(Array(length).keys()).map((n) => {
        const log = Math.log(n + (offset ?? 0) + 1)
        return {
          color: randColor(),
          name: uniqueNamesGenerator({ dictionaries: [starWars] }),
          time: 383117 + log,
          speed: randomInt(78, 80) - log,
        } as User
      })
      return new Promise<User[]>((resolve) => {
        setTimeout(() => {
          resolve(data)
          setLoading(false)
        }, randomInt(150, 600))
      })
    },
    [length]
  )

  useEffect(() => {
    mockData().then((data) => {
      setUsers(data)
    })
  }, [])

  const loadMore = useCallback(() => {
    if (loading) {
      return
    }
    mockData(offset).then((data) => {
      setUsers((prev) => prev.concat(data))
    })
  }, [loading, offset])

  const refList = useRef<HTMLDivElement>(null)

  const onScrollList: React.UIEventHandler<HTMLDivElement> = debounce(() => {
    const el = refList.current
    if (!el) {
      return
    }
    const { height } = el.getBoundingClientRect()
    const scrollBottom = el.scrollTop + height
    if (el.scrollHeight < scrollBottom + 50) {
      loadMore()
    }
  }, 50)

  return (
    <>
      {!!users.length && (
        <div
          //
          ref={refList}
          onScroll={onScrollList}
          className="dashboard"
        >
          {users.map((user, index) => {
            return (
              <UserItem
                //
                key={index}
                user={user}
                index={index}
                active={active}
                onClick={() => setActive(index)}
              />
            )
          })}
          {loading && <div>Loading...</div>}
        </div>
      )}
    </>
  )
}

interface UserItemProps {
  user: User
  index: number
  active: number | null
  onClick: React.MouseEventHandler<HTMLDivElement>
}
function UserItem({ user, index, active, onClick }: UserItemProps) {
  const { ref, inView } = useInView()

  const time = user.time / 1000
  const minutes = Math.floor(time / 60)
  const seconds = time % 60

  const formatMinutes = minutes.toString().padStart(2, '0')
  const formatSeconds = seconds.toFixed(3).toString().padStart(6, '0')

  return (
    <div ref={ref} style={{ minHeight: 60 }}>
      {inView && (
        <div
          //
          onClick={onClick}
          className={`user ${index === active ? 'user--active' : ''}`}
        >
          <span className="user__index">{index + 1}</span>
          <div style={{ color: Color[user.color] }} className="user__icon">
            <HelmetSvg />
          </div>
          <div className="user__caption">
            <div className="user__name">{user.name}</div>
            <div className="user__info">
              <span className="user__time">{`${formatMinutes}:${formatSeconds}`}</span>
              <span>|</span>
              <span className="user__speed">{Math.floor(user.speed)} km/h</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
