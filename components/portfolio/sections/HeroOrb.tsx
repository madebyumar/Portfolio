'use client'

import React, { useEffect, useRef } from 'react'

export function HeroOrb() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let mx = 0, my = 0, tx = 0, ty = 0
    let w = 0, h = 0
    let lw = 0, lh = 0, ldpr = 0
    let raf: number

    // Golden ratio icosahedron geometry
    const t = (1 + Math.sqrt(5)) / 2
    const v = [
      [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
      [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
      [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
    ]
    const n = Math.sqrt(1 + t * t)
    const verts = v.map(p => p.map(c => c / n))
    const edges: [number, number][] = []
    for (let i = 0; i < 12; i++) {
      for (let j = i + 1; j < 12; j++) {
        const d = Math.hypot(v[i][0] - v[j][0], v[i][1] - v[j][1], v[i][2] - v[j][2])
        if (d < 2.1) edges.push([i, j])
      }
    }

    const particles = Array.from({ length: 90 }, () => {
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      const r = 1.25 + Math.random() * 0.9
      return {
        x: r * Math.sin(ph) * Math.cos(th),
        y: r * Math.sin(ph) * Math.sin(th),
        z: r * Math.cos(ph),
        s: 0.6 + Math.random() * 1.6
      }
    })

    const onPointerMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      tx = ((e.clientX - r.left) / Math.max(r.width, 1) - 0.5) * 2
      ty = ((e.clientY - r.top) / Math.max(r.height, 1) - 0.5) * 2
    }
    window.addEventListener('pointermove', onPointerMove)

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = canvas.getBoundingClientRect()
      if (r.width === lw && r.height === lh && ldpr === dpr) return
      lw = r.width
      lh = r.height
      ldpr = dpr
      if (!r.width || !r.height) { w = 0; h = 0; return; }
      canvas.width = Math.max(1, r.width * dpr)
      canvas.height = Math.max(1, r.height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      w = r.width
      h = r.height
    }

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(resize)
    })
    ro.observe(canvas)
    resize()

    const rot = (p: number[], ax: number, ay: number): [number, number, number] => {
      const [x, y, z] = p
      const c = Math.cos(ay), s = Math.sin(ay)
      const x1 = x * c + z * s, z1 = -x * s + z * c
      const c2 = Math.cos(ax), s2 = Math.sin(ax)
      const y2 = y * c2 - z1 * s2, z2 = y * s2 + z1 * c2
      return [x1, y2, z2]
    }

    const t0 = performance.now()
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const wire = (
      ax: number,
      ay: number,
      scale: number,
      color: string,
      alpha: number,
      proj: (p: [number, number, number]) => [number, number, number, number]
    ) => {
      const pts = verts.map(p => rot([p[0] * scale, p[1] * scale, p[2] * scale], ax, ay))
      ctx.lineWidth = 1
      for (const [a, b] of edges) {
        const [x1, y1, , z1] = proj(pts[a])
        const [x2, y2, , z2] = proj(pts[b])
        const depth = (z1 + z2) / 2
        ctx.globalAlpha = alpha * Math.max(0.12, 0.75 - depth * 0.5)
        ctx.strokeStyle = color
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }
      for (const p of pts) {
        const [sx, sy, f, z] = proj(p)
        ctx.globalAlpha = Math.max(0.15, 0.9 - z * 0.6) * alpha
        ctx.beginPath()
        ctx.arc(sx, sy, 2.2 * f * scale + 0.6, 0, 7)
        ctx.fillStyle = color
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const loop = (now: number) => {
      if (!w || !h) {
        resize()
      }
      if (w && h) {
        ctx.clearRect(0, 0, w, h)
        mx += (tx - mx) * 0.05
        my += (ty - my) * 0.05
        const tm = reducedMotion.matches ? 0 : (now - t0) / 1000
        const ay = tm * 0.25 + mx * 0.9
        const ax = 0.35 + my * 0.6
        const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.30

        const proj = (p: [number, number, number]): [number, number, number, number] => {
          const zz = p[2] + 3.2
          const f = 3.0 / zz
          return [cx + p[0] * R * f * 1.6, cy + p[1] * R * f * 1.6, f, p[2]]
        }

        const isLight = document.documentElement.getAttribute('data-theme') === 'light'
        const computedAccent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
        const activeAccent = computedAccent || (isLight ? '#2563eb' : '#d4ff3f')
        const activeAccent2 = isLight ? 'rgba(9, 9, 11, 0.22)' : '#8a8676'

        for (const pt of particles) {
          const p = rot([pt.x, pt.y, pt.z], ax, ay * 0.7)
          const [sx, sy, f, z] = proj(p)
          const a = Math.max(0.06, 0.5 - z * 0.35)
          ctx.beginPath()
          ctx.arc(sx, sy, pt.s * f, 0, 7)
          ctx.fillStyle = z > 0.4 ? activeAccent2 : activeAccent
          ctx.globalAlpha = a
          ctx.fill()
        }
        ctx.globalAlpha = 1

        // Inner counter-rotating icosahedron
        wire(ax * 1.3, -ay * 1.6, 0.45, activeAccent2, isLight ? 0.5 : 0.35, proj)
        // Main glowing icosahedron
        wire(ax, ay, 1, activeAccent, 0.9, proj)
      }

      if (!reducedMotion.matches) raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    const onMotionChange = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(loop)
    }
    reducedMotion.addEventListener('change', onMotionChange)

    return () => {
      cancelAnimationFrame(raf)
      reducedMotion.removeEventListener('change', onMotionChange)
      window.removeEventListener('pointermove', onPointerMove)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      id="hero-orb-canvas"
      className="hero-orb-canvas"
      style={{
        position: 'absolute',
        top: '50%',
        right: '2%',
        transform: 'translateY(-50%)',
        width: 'min(46vw, 680px)',
        height: 'min(46vw, 680px)',
        cursor: 'crosshair',
        zIndex: 1,
        display: 'block',
      }}
    />
  )
}

