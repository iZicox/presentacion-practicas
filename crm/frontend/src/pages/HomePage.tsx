import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ErrorState from '../components/common/ErrorState'
import LoadingSpinner from '../components/common/LoadingSpinner'
import PageHeader from '../components/common/PageHeader'
import SoftBadge from '../components/common/SoftBadge'
import StatCard from '../components/common/StatCard'
import { IconBriefcase, IconCart, IconEuro, IconMessage } from '../components/common/icons'
import { ApiError, api } from '../services/api'
import type { Company, Interaction, Purchase, Status } from '../types'
import {
  formatCents,
  formatCentsCompact,
  formatDate,
  formatMonthLong,
  formatMonthShort,
  formatRelativeDate,
} from '../utils/format'
import { statusTone } from '../utils/labels'

type LoadStatus = 'loading' | 'error' | 'ready'

interface Overview {
  companies: Company[]
  statuses: Status[]
  interactions: Interaction[]
  purchases: Purchase[]
}

const MONTHS_IN_CHART = 6
const RECENT_ITEMS = 5

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

/** Fecha YYYY-MM-DD para comparar con los campos DATE. */
function isoDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

/** Prototipo: el panel compone el resumen desde los listados existentes. */
async function loadOverview(): Promise<Overview> {
  const [companies, statuses] = await Promise.all([api.listCompanies(), api.listStatuses()])
  const [interactionLists, purchaseLists] = await Promise.all([
    Promise.all(companies.map((company) => api.listInteractions(company.ID))),
    Promise.all(companies.map((company) => api.listPurchases(company.ID))),
  ])
  return {
    companies,
    statuses,
    interactions: interactionLists.flat(),
    purchases: purchaseLists.flat(),
  }
}

function sortByDateDesc<T extends { DATE: string; ID: number }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => (a.DATE === b.DATE ? b.ID - a.ID : a.DATE < b.DATE ? 1 : -1))
}

/** Panel de inicio: indicadores, gráfico de compras y actividad reciente. */
export default function HomePage() {
  const [overview, setOverview] = useState<Overview | null>(null)
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true

    loadOverview()
      .then((data) => {
        if (active) {
          setOverview(data)
          setStatus('ready')
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setErrorMessage(
            error instanceof ApiError ? error.message : 'No se pudo cargar el panel de inicio.',
          )
          setStatus('error')
        }
      })

    return () => {
      active = false
    }
  }, [reloadKey])

  const handleRetry = () => {
    setStatus('loading')
    setReloadKey((key) => key + 1)
  }

  const now = new Date()
  const currentMonth = monthKey(now)

  const companies = overview?.companies ?? []
  const interactions = sortByDateDesc(overview?.interactions ?? [])
  const purchases = sortByDateDesc(overview?.purchases ?? [])
  const statuses = overview?.statuses ?? []
  const companyById = new Map(companies.map((company) => [company.ID, company]))

  const newCompaniesThisMonth = companies.filter(
    (company) => company.CREATED_AT.slice(0, 7) === currentMonth,
  ).length

  const monthAgo = new Date(now)
  monthAgo.setDate(monthAgo.getDate() - 30)
  const interactionsLast30 = interactions.filter(
    (interaction) => interaction.DATE >= isoDate(monthAgo),
  )

  const monthPurchases = purchases.filter((purchase) => purchase.DATE.slice(0, 7) === currentMonth)
  const monthTotalCents = monthPurchases.reduce((sum, purchase) => sum + purchase.AMOUNT_CENTS, 0)
  const monthAverageCents =
    monthPurchases.length > 0 ? Math.round(monthTotalCents / monthPurchases.length) : null

  const chartMonths = Array.from({ length: MONTHS_IN_CHART }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (MONTHS_IN_CHART - 1 - index), 1)
    return { key: monthKey(date), label: formatMonthShort(date), total: 0 }
  })
  for (const purchase of purchases) {
    const bucket = chartMonths.find((month) => month.key === purchase.DATE.slice(0, 7))
    if (bucket) {
      bucket.total += purchase.AMOUNT_CENTS
    }
  }
  const chartMax = Math.max(...chartMonths.map((month) => month.total), 1)
  const chartTotal = chartMonths.reduce((sum, month) => sum + month.total, 0)

  const statusDistribution = statuses.map((item) => ({
    status: item,
    count: companies.filter((company) => company.STATUS_ID === item.ID).length,
  }))
  const unclassified = companies.filter((company) => company.STATUS_ID === null).length
  const distributionMax = Math.max(
    ...statusDistribution.map((entry) => entry.count),
    unclassified,
    1,
  )

  const recentInteractions = interactions.slice(0, RECENT_ITEMS)
  const recentPurchases = purchases.slice(0, RECENT_ITEMS)
  const lastInteraction = interactions[0]

  return (
    <>
      <PageHeader
        title="Inicio"
        description={`Resumen general de la actividad comercial · ${formatMonthLong(now)}`}
      />

      {status === 'loading' ? <LoadingSpinner label="Cargando el panel…" /> : null}
      {status === 'error' ? <ErrorState message={errorMessage} onRetry={handleRetry} /> : null}

      {status === 'ready' ? (
        <>
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                label="Empresas"
                value={String(companies.length)}
                hint={`${newCompaniesThisMonth} nuevas este mes`}
                icon={<IconBriefcase size={19} />}
                tone="indigo"
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                label="Interacciones (30 días)"
                value={String(interactionsLast30.length)}
                hint={
                  lastInteraction
                    ? `Última: ${formatRelativeDate(lastInteraction.DATE) ?? 'sin fecha'}`
                    : 'Sin registros todavía'
                }
                icon={<IconMessage size={19} />}
                tone="violet"
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                label="Compras del mes"
                value={formatCents(monthTotalCents)}
                hint={`${monthPurchases.length} ${monthPurchases.length === 1 ? 'compra' : 'compras'} en ${formatMonthLong(now)}`}
                icon={<IconCart size={19} />}
                tone="green"
              />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
              <StatCard
                label="Ticket medio del mes"
                value={monthAverageCents !== null ? formatCents(monthAverageCents) : '—'}
                hint="Importe medio por compra"
                icon={<IconEuro size={19} />}
                tone="amber"
              />
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-12 col-lg-7">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <span className="fw-semibold">Compras · últimos 6 meses</span>
                  <span className="text-secondary small">
                    Total: <span className="amount-cell">{formatCents(chartTotal)}</span>
                  </span>
                </div>
                <div className="card-body">
                  <div className="chart-bars" role="img" aria-label="Compras por mes">
                    {chartMonths.map((month) => (
                      <div className="chart-col" key={month.key}>
                        <div className="chart-value">
                          {month.total > 0 ? formatCentsCompact(month.total) : ''}
                        </div>
                        <div className="chart-track">
                          <div
                            className="chart-bar"
                            style={{
                              height: `${month.total > 0 ? Math.max((month.total / chartMax) * 100, 3) : 0}%`,
                            }}
                          />
                        </div>
                        <div className="chart-label">{month.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-5">
              <div className="card h-100">
                <div className="card-header">
                  <span className="fw-semibold">Empresas por estado</span>
                </div>
                <div className="card-body d-flex flex-column gap-3">
                  {statusDistribution.map(({ status: item, count }) => (
                    <div className="dist-row" key={item.ID}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <SoftBadge tone={statusTone(item.NAME)} dot>
                          {item.NAME}
                        </SoftBadge>
                        <span className="dist-count">{count}</span>
                      </div>
                      <div className="dist-track">
                        <div
                          className="dist-fill"
                          style={{ width: `${(count / distributionMax) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {unclassified > 0 ? (
                    <div className="dist-row">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <SoftBadge tone="slate">Sin clasificar</SoftBadge>
                        <span className="dist-count">{unclassified}</span>
                      </div>
                      <div className="dist-track">
                        <div
                          className="dist-fill dist-fill-slate"
                          style={{ width: `${(unclassified / distributionMax) * 100}%` }}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12 col-lg-7">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <span className="fw-semibold">Últimas interacciones</span>
                  <Link to="/companies" className="small text-decoration-none">
                    Ver empresas
                  </Link>
                </div>
                <div className="card-body py-2">
                  {recentInteractions.length === 0 ? (
                    <p className="text-secondary small mb-2 mt-2">Sin interacciones registradas.</p>
                  ) : (
                    <ul className="feed">
                      {recentInteractions.map((interaction) => {
                        const company = companyById.get(interaction.COMPANY_ID)
                        return (
                          <li className="feed-item" key={interaction.ID}>
                            <span className="feed-date">{formatDate(interaction.DATE)}</span>
                            <div className="min-w-0">
                              <div className="row-title">{interaction.DESCRIPTION}</div>
                              <div className="row-sub">
                                {company ? (
                                  <Link
                                    to={`/companies/${company.ID}`}
                                    className="text-decoration-none"
                                  >
                                    {company.NAME}
                                  </Link>
                                ) : (
                                  'Empresa desconocida'
                                )}
                              </div>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-5">
              <div className="card h-100">
                <div className="card-header">
                  <span className="fw-semibold">Últimas compras</span>
                </div>
                <div className="card-body py-2">
                  {recentPurchases.length === 0 ? (
                    <p className="text-secondary small mb-2 mt-2">Sin compras registradas.</p>
                  ) : (
                    <ul className="feed">
                      {recentPurchases.map((purchase) => {
                        const company = companyById.get(purchase.COMPANY_ID)
                        return (
                          <li className="feed-item" key={purchase.ID}>
                            <span className="feed-date">{formatDate(purchase.DATE)}</span>
                            <div className="min-w-0 flex-grow-1 d-flex justify-content-between gap-2">
                              <div className="row-sub text-truncate">
                                {company ? (
                                  <Link
                                    to={`/companies/${company.ID}`}
                                    className="text-decoration-none"
                                  >
                                    {company.NAME}
                                  </Link>
                                ) : (
                                  'Empresa desconocida'
                                )}
                              </div>
                              <span className="amount-cell">
                                {formatCents(purchase.AMOUNT_CENTS)}
                              </span>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  )
}
