'use client'

import React, { useState } from 'react'
import styles from '@/styles/search_styles/search.module.css'
import SearchFilterPanel from '@/components/search_components/search_filter_panel'
import SearchResultsTable from '@/components/search_components/search_results_table'
import { searchPosts } from './actions/search'
import { SearchCriteria, SearchResult } from '@/types/api_types'

export default function FindRentalsClient({ initialResults }: { initialResults: SearchResult[] }) {
  const [criteria, setCriteria] = useState<SearchCriteria>({
    features: [],
    rules: [],
    order_by: 'newest',
  })
  const [results, setResults] = useState<SearchResult[]>(initialResults)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await searchPosts(criteria)
      setResults(data)
    } catch (err: any) {
      console.error('Search failed:', err)
      setError(err.message || 'Something went wrong during search.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Find Rentals</h1>

      {error && (
        <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <SearchFilterPanel
        criteria={criteria}
        setCriteria={setCriteria}
        onSearch={handleSearch}
        loading={loading}
      />

      <SearchResultsTable results={results} />
    </div>
  )
}
