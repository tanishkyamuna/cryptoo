import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TradingSignal } from '@/types'

interface SignalsState {
  // Signals data
  signals: TradingSignal[]
  loading: boolean
  error: string | null
  
  // Filters
  selectedStrategy: 'all' | 'day' | 'swing' | 'long-term'
  selectedRisk: 'all' | 'low' | 'medium' | 'high'
  selectedStatus: 'all' | 'active' | 'expired'
  
  // Actions
  setSignals: (signals: TradingSignal[]) => void
  addSignal: (signal: TradingSignal) => void
  updateSignal: (signalId: string, updates: Partial<TradingSignal>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setStrategyFilter: (strategy: SignalsState['selectedStrategy']) => void
  setRiskFilter: (risk: SignalsState['selectedRisk']) => void
  setStatusFilter: (status: SignalsState['selectedStatus']) => void
  getFilteredSignals: () => TradingSignal[]
  clearSignals: () => void
}

export const useSignalsStore = create<SignalsState>()(
  persist(
    (set, get) => ({
      // Initial state
      signals: [],
      loading: false,
      error: null,
      selectedStrategy: 'all',
      selectedRisk: 'all',
      selectedStatus: 'active',

      // Actions
      setSignals: (signals: TradingSignal[]) => {
        set({ signals, error: null })
      },

      addSignal: (signal: TradingSignal) => {
        set((state) => ({
          signals: [signal, ...state.signals]
        }))
      },

      updateSignal: (signalId: string, updates: Partial<TradingSignal>) => {
        set((state) => ({
          signals: state.signals.map(signal =>
            signal.id === signalId ? { ...signal, ...updates } : signal
          )
        }))
      },

      setLoading: (loading: boolean) => {
        set({ loading })
      },

      setError: (error: string | null) => {
        set({ error })
      },

      setStrategyFilter: (strategy: SignalsState['selectedStrategy']) => {
        set({ selectedStrategy: strategy })
      },

      setRiskFilter: (risk: SignalsState['selectedRisk']) => {
        set({ selectedRisk: risk })
      },

      setStatusFilter: (status: SignalsState['selectedStatus']) => {
        set({ selectedStatus: status })
      },

      getFilteredSignals: () => {
        const state = get()
        let filtered = state.signals

        // Filter by strategy
        if (state.selectedStrategy !== 'all') {
          filtered = filtered.filter(signal => signal.strategy_type === state.selectedStrategy)
        }

        // Filter by risk level
        if (state.selectedRisk !== 'all') {
          filtered = filtered.filter(signal => signal.risk_level === state.selectedRisk)
        }

        // Filter by status
        if (state.selectedStatus === 'active') {
          filtered = filtered.filter(signal => 
            signal.is_active && new Date(signal.expires_at) > new Date()
          )
        } else if (state.selectedStatus === 'expired') {
          filtered = filtered.filter(signal => 
            !signal.is_active || new Date(signal.expires_at) <= new Date()
          )
        }

        return filtered.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      },

      clearSignals: () => {
        set({
          signals: [],
          loading: false,
          error: null,
          selectedStrategy: 'all',
          selectedRisk: 'all',
          selectedStatus: 'active'
        })
      }
    }),
    {
      name: 'cryptoquiver-signals-storage',
      partialize: (state) => ({
        signals: state.signals,
        selectedStrategy: state.selectedStrategy,
        selectedRisk: state.selectedRisk,
        selectedStatus: state.selectedStatus
      })
    }
  )
)
