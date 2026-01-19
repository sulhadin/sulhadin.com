'use client'

import React from 'react'
// components.js - Add these to your existing components.js file

// 1. Array.fromAsync Demo (you already have this one working)
export function ArrayFromAsyncDemo() {
  const [isRunning, setIsRunning] = React.useState(false);
  const [logs, setLogs] = React.useState([]);
  const [result, setResult] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && !window.Array.fromAsync) {
      window.Array.fromAsync = async function(asyncIterable, mapFn, thisArg) {
        const result = [];
        let index = 0;
        for await (const value of asyncIterable) {
          const mappedValue = mapFn 
            ? await mapFn.call(thisArg, value, index)
            : value;
          result[index++] = mappedValue;
        }
        return result;
      };
    }
  }, []);

  async function* countdown(from) {
    for (let i = from; i > 0; i--) {
      await new Promise(resolve => setTimeout(resolve, 800));
      addLog(`Yielding: ${i}`);
      yield i;
    }
  }

  const addLog = (message) => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), message }]);
  };

  const runBasic = async () => {
    setIsRunning(true);
    setLogs([]);
    setResult(null);
    addLog('Starting countdown...');
    
    try {
      const numbers = await Array.fromAsync(countdown(5));
      addLog(`Completed! Result: [${numbers.join(', ')}]`);
      setResult(numbers);
    } catch (error) {
      addLog(`Error: ${error.message}`);
    }
    
    setIsRunning(false);
  };

  const runWithMapping = async () => {
    setIsRunning(true);
    setLogs([]);
    setResult(null);
    addLog('Starting countdown with mapping (x2)...');
    
    try {
      const numbers = await Array.fromAsync(countdown(5), n => n * 2);
      addLog(`Completed! Result: [${numbers.join(', ')}]`);
      setResult(numbers);
    } catch (error) {
      addLog(`Error: ${error.message}`);
    }
    
    setIsRunning(false);
  };

  return (
    <div style={{
      maxWidth: '900px',
      margin: '2rem auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: 'linear-gradient(135deg, #e0f2fe 0%, #ddd6fe 100%)',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '1px solid #c7d2fe'
    }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', margin: '0 0 0.5rem 0' }}>
          Array.fromAsync() Interactive Demo
        </h3>
        <p style={{ color: '#475569', margin: 0, fontSize: '0.95rem' }}>
          Watch how Array.fromAsync() collects values from an async iterator in real-time
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={runBasic}
          disabled={isRunning}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            color: 'white',
            background: isRunning ? '#94a3b8' : '#4f46e5',
            opacity: isRunning ? 0.6 : 1
          }}
        >
          {isRunning ? 'Running...' : 'Run Basic Demo'}
        </button>
        
        <button
          onClick={runWithMapping}
          disabled={isRunning}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            color: 'white',
            background: isRunning ? '#94a3b8' : '#7c3aed',
            opacity: isRunning ? 0.6 : 1
          }}
        >
          {isRunning ? 'Running...' : 'Run with Mapping (x2)'}
        </button>
      </div>

      {logs.length > 0 && (
        <div style={{
          background: '#1e293b',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1rem',
          fontFamily: '"Courier New", monospace',
          fontSize: '0.85rem',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Console Output:
          </div>
          {logs.map((log, i) => (
            <div key={i} style={{ color: '#d1d5db', padding: '0.25rem 0' }}>
              <span style={{ color: '#6b7280', marginRight: '0.5rem' }}>[{log.time}]</span>
              {log.message}
            </div>
          ))}
        </div>
      )}

      {result && (
        <div style={{
          background: 'white',
          border: '2px solid #10b981',
          borderRadius: '8px',
          padding: '1rem'
        }}>
          <div style={{
            color: '#047857',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>✅</span>
            <span>Final Result:</span>
          </div>
          <div style={{
            fontFamily: '"Courier New", monospace',
            fontSize: '1.1rem',
            color: '#1e293b'
          }}>
            [{result.join(', ')}]
          </div>
        </div>
      )}

      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '1rem',
        marginTop: '1rem'
      }}>
        <div style={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>
          How it works:
        </div>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
            Creates an async generator that yields numbers with 800ms delays
          </li>
          <li style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
            Array.fromAsync() awaits each value as it's yielded
          </li>
          <li style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
            Optionally applies a mapping function to each value
          </li>
          <li style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
            Returns a complete array once iteration finishes
          </li>
        </ul>
      </div>
    </div>
  );
}

// 2. RegExp.escape Demo
export function RegExpEscapeDemo() {
  const [searchText, setSearchText] = React.useState('$49.99');
  const [targetText, setTargetText] = React.useState('The price is $49.99 for the item');
  const [results, setResults] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && !RegExp.escape) {
      RegExp.escape = function(string) {
        return string.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\//g, '\\/');
      };
    }
  }, []);

  const tryMatch = (text, search, useEscape) => {
    try {
      const pattern = useEscape ? RegExp.escape(search) : search;
      const regex = new RegExp(pattern, 'gi');
      const matches = text.match(regex);
      return {
        success: true,
        matches: matches || [],
        highlighted: matches ? text.replace(regex, match => `✨${match}✨`) : text
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  };

  const testSearch = () => {
    const withoutEscape = tryMatch(targetText, searchText, false);
    const withEscape = tryMatch(targetText, searchText, true);
    
    setResults({
      without: withoutEscape,
      with: withEscape,
      escaped: RegExp.escape(searchText)
    });
  };

  const presets = [
    { search: '$49.99', text: 'The price is $49.99 today' },
    { search: 'user@example.com', text: 'Email: user@example.com' },
    { search: '(a + b)', text: 'Formula: (a + b) * c' },
    { search: 'C:\\Users', text: 'Path: C:\\Users\\Documents' },
    { search: '[1, 2, 3]', text: 'Array: [1, 2, 3]' },
  ];

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '2rem auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: 'linear-gradient(135deg, #fff7ed 0%, #fef2f2 100%)',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '1px solid #fed7aa'
    }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', margin: '0 0 0.5rem 0' }}>
          RegExp.escape() Interactive Demo
        </h3>
        <p style={{ color: '#475569', margin: 0, fontSize: '0.95rem' }}>
          See how special regex characters break searches without escaping
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
            Search Term
          </label>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.875rem',
              boxSizing: 'border-box',
              background: 'white',
              color: '#1e293b',
              outline: 'none'
            }}
            placeholder="Enter search term..."
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
            Text to Search In
          </label>
          <input
            type="text"
            value={targetText}
            onChange={(e) => setTargetText(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.875rem',
              boxSizing: 'border-box',
              background: 'white',
              color: '#1e293b',
              outline: 'none'
            }}
            placeholder="Enter target text..."
          />
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Quick Presets:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {presets.map((preset, i) => (
            <button
              key={i}
              onClick={() => { setSearchText(preset.search); setTargetText(preset.text); setResults(null); }}
              style={{
                padding: '0.5rem 1rem',
                background: 'white',
                border: '1px solid #fed7aa',
                borderRadius: '6px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                color: '#1e293b'
              }}
            >
              {preset.search}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={testSearch}
        style={{
          width: '100%',
          padding: '0.75rem 1.5rem',
          background: '#ea580c',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          fontSize: '0.9rem',
          cursor: 'pointer',
          marginBottom: '1.5rem'
        }}
      >
        Test Search
      </button>

      {results && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            background: results.without.success ? '#fef3c7' : '#fee2e2',
            border: `2px solid ${results.without.success ? '#fbbf24' : '#f87171'}`,
            borderRadius: '8px',
            padding: '1rem',
            color: '#1e293b'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{results.without.success ? '⚠️' : '❌'}</span>
              <span style={{ fontWeight: 'bold', color: '#1e293b' }}>Without RegExp.escape()</span>
            </div>
            {results.without.success ? (
              <>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                  Matches found: {results.without.matches.length}
                </div>
                <div style={{
                  fontFamily: '"Courier New", monospace',
                  fontSize: '0.875rem',
                  background: 'white',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #fbbf24',
                  color: '#1e293b'
                }}>
                  {results.without.highlighted}
                </div>
              </>
            ) : (
              <div style={{ color: '#dc2626', fontFamily: '"Courier New", monospace', fontSize: '0.875rem', color: '#1e293b' }}>
                💥 Error: {results.without.error}
              </div>
            )}
          </div>

          <div style={{
            background: '#dcfce7',
            border: '2px solid #22c55e',
            borderRadius: '8px',
            padding: '1rem',
            color: '#1e293b'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>✅</span>
              <span style={{ fontWeight: 'bold', color: '#1e293b' }}>With RegExp.escape()</span>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              Matches found: {results.with.matches.length}
            </div>
            <div style={{
              fontFamily: '"Courier New", monospace',
              fontSize: '0.875rem',
              background: 'white',
              padding: '0.75rem',
              borderRadius: '6px',
              border: '1px solid #22c55e',
              marginBottom: '0.75rem',
              color: '#1e293b'
            }}>
              {results.with.highlighted}
            </div>
            <div style={{ background: 'white', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Escaped pattern:</div>
              <div style={{ fontFamily: '"Courier New", monospace', fontSize: '0.875rem', color: '#1e293b' }}>
                {results.escaped}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '8px', padding: '1rem', marginTop: '1rem' }}>
        <div style={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>
          Characters that need escaping:
        </div>
        <div style={{ fontFamily: '"Courier New", monospace', color: '#6b7280', marginBottom: '0.5rem' }}>
          ^ $ \ . * + ? ( ) [ ] {'{}'} |
        </div>
        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          Without escaping, these are interpreted as regex special characters and will cause errors or unexpected matches.
        </div>
      </div>
    </div>
  );
}

// Continue in next message...
// components.js - Part 2 (continue from previous)

// 3. Error.isError Demo
export function ErrorIsErrorDemo() {
  const [testResults, setTestResults] = React.useState(null);
  const [crossRealmResult, setCrossRealmResult] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && !Error.isError) {
      Error.isError = function(value) {
        return value instanceof Error ||
               (value && value.constructor && value.constructor.name === 'Error') ||
               Object.prototype.toString.call(value) === '[object Error]';
      };
    }
  }, []);

  const runTests = () => {
    const tests = [
      { name: 'Regular Error', value: new Error('test'), expect: true },
      { name: 'TypeError', value: new TypeError('test'), expect: true },
      { name: 'RangeError', value: new RangeError('test'), expect: true },
      { name: 'Object.create(Error.prototype)', value: Object.create(Error.prototype), expect: true },
      { name: 'Plain object', value: { message: 'error', stack: 'fake' }, expect: false },
      { name: 'Error-like object', value: { name: 'Error', message: 'test' }, expect: false },
      { name: 'String', value: 'Error: something', expect: false },
      { name: 'Null', value: null, expect: false },
      { name: 'Undefined', value: undefined, expect: false },
    ];

    const results = tests.map(test => ({
      name: test.name,
      isError: Error.isError(test.value),
      instanceof: test.value instanceof Error,
      correct: Error.isError(test.value) === test.expect,
      differs: Error.isError(test.value) !== (test.value instanceof Error)
    }));

    setTestResults(results);
  };

  const testCrossRealm = () => {
    if (typeof window === 'undefined') {
      setCrossRealmResult({ error: 'Browser only feature' });
      return;
    }

    try {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      const iframeError = new iframe.contentWindow.Error('From iframe');
      
      setCrossRealmResult({
        isError: Error.isError(iframeError),
        instanceof: iframeError instanceof Error,
        iframeInstanceOf: iframeError instanceof iframe.contentWindow.Error
      });
      
      document.body.removeChild(iframe);
    } catch (error) {
      setCrossRealmResult({ error: error.message });
    }
  };

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '2rem auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: 'linear-gradient(135deg, #fae8ff 0%, #f3e8ff 100%)',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '1px solid #d8b4fe'
    }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', margin: '0 0 0.5rem 0' }}>
          Error.isError() Interactive Demo
        </h3>
        <p style={{ color: '#475569', margin: 0, fontSize: '0.95rem' }}>
          Test the difference between Error.isError() and instanceof Error
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={runTests}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#9333ea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Run Tests
        </button>
        
        <button
          onClick={testCrossRealm}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#db2777',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Test Cross-Realm (iframe)
        </button>
      </div>

      {testResults && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #d1d5db', overflow: 'hidden' }}>
            <div style={{ background: '#f3f4f6', padding: '1rem', borderBottom: '1px solid #d1d5db', fontWeight: 'bold', color: '#374151' }}>
              Test Results
            </div>
            {testResults.map((result, i) => (
              <div key={i} style={{
                padding: '1rem',
                borderBottom: i < testResults.length - 1 ? '1px solid #e5e7eb' : 'none'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>{result.name}</span>
                  {result.correct ? (
                    <span style={{ color: '#22c55e', fontWeight: 600 }}>✅ Correct</span>
                  ) : (
                    <span style={{ color: '#ef4444', fontWeight: 600 }}>❌ Wrong</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
                  <div style={{ color: result.isError ? '#22c55e' : '#6b7280' }}>
                    {result.isError ? '✅' : '❌'} Error.isError()
                  </div>
                  <div style={{ color: result.instanceof ? '#22c55e' : '#6b7280' }}>
                    {result.instanceof ? '✅' : '❌'} instanceof Error
                  </div>
                  {result.differs && (
                    <span style={{ color: '#f59e0b', fontWeight: 600, marginLeft: 'auto' }}>
                      ⚠️ Different results!
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {crossRealmResult && (
        <div style={{ background: 'white', borderRadius: '8px', border: '2px solid #a855f7', padding: '1rem' }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🌐</span>
            <span>Cross-Realm Test (iframe)</span>
          </div>
          
          {crossRealmResult.error ? (
            <div style={{ color: '#ef4444' }}>Error: {crossRealmResult.error}</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f9fafb', borderRadius: '6px' }}>
                <span style={{ color: '#374151' }}>Error.isError(iframeError)</span>
                <span style={{ fontWeight: 'bold', color: crossRealmResult.isError ? '#22c55e' : '#ef4444' }}>
                  {crossRealmResult.isError ? '✅ true' : '❌ false'}
                </span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f9fafb', borderRadius: '6px' }}>
                <span style={{ color: '#374151' }}>iframeError instanceof Error</span>
                <span style={{ fontWeight: 'bold', color: crossRealmResult.instanceof ? '#22c55e' : '#ef4444' }}>
                  {crossRealmResult.instanceof ? '✅ true' : '❌ false'}
                </span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f9fafb', borderRadius: '6px' }}>
                <span style={{ color: '#374151' }}>iframeError instanceof iframe.Error</span>
                <span style={{ fontWeight: 'bold', color: crossRealmResult.iframeInstanceOf ? '#22c55e' : '#ef4444' }}>
                  {crossRealmResult.iframeInstanceOf ? '✅ true' : '❌ false'}
                </span>
              </div>
              
              {!crossRealmResult.instanceof && crossRealmResult.isError && (
                <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: '6px' }}>
                  <div style={{ fontWeight: 'bold', color: '#92400e', marginBottom: '0.25rem' }}>⚠️ Cross-Realm Issue!</div>
                  <div style={{ fontSize: '0.875rem', color: '#78350f' }}>
                    The error is from a different realm (iframe), so <code style={{ background: '#fde68a', padding: '0 0.25rem', borderRadius: '2px' }}>instanceof Error</code> returns false, 
                    but <code style={{ background: '#fde68a', padding: '0 0.25rem', borderRadius: '2px' }}>Error.isError()</code> correctly identifies it as an error.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '8px', padding: '1rem', marginTop: '1.5rem' }}>
        <div style={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>
          Why Error.isError() matters:
        </div>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
            <code style={{ background: '#f3f4f6', padding: '0 0.25rem', borderRadius: '2px' }}>instanceof Error</code> fails with errors from iframes, workers, or Node.js vm modules
          </li>
          <li style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
            <code style={{ background: '#f3f4f6', padding: '0 0.25rem', borderRadius: '2px' }}>Error.isError()</code> checks internal slots instead of prototype chain
          </li>
          <li style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
            Works reliably across all JavaScript realms
          </li>
          <li style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
            Correctly rejects objects that just look like errors
          </li>
        </ul>
      </div>
    </div>
  );
}

// 4. Using Declarations Demo
export function UsingDeclarationsDemo() {
  const [logs, setLogs] = React.useState([]);
  const [isRunning, setIsRunning] = React.useState(false);

  class Resource {
    constructor(name, dependsOn = null) {
      this.name = name;
      this.dependsOn = dependsOn;
      this.timestamp = Date.now();
      this.disposed = false;
      addLog(`✅ ${name} acquired`, 'success');
    }
    
    use() {
      if (this.disposed) {
        throw new Error(`${this.name} already disposed!`);
      }
      addLog(`🔧 Using ${this.name}`, 'info');
    }
    
    [Symbol.dispose]() {
      if (this.disposed) return;
      
      const duration = Date.now() - this.timestamp;
      this.disposed = true;
      addLog(`❌ ${this.name} disposed after ${duration}ms`, 'dispose');
    }
  }

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { 
      time: new Date().toLocaleTimeString(), 
      message, 
      type 
    }]);
  };

  const demoBasicUsage = async () => {
    setIsRunning(true);
    setLogs([]);
    
    addLog('Starting basic demo...', 'info');
    await new Promise(r => setTimeout(r, 500));
    
    const resource = new Resource('File Handle');
    
    try {
      await new Promise(r => setTimeout(r, 500));
      resource.use();
      
      await new Promise(r => setTimeout(r, 500));
      addLog('Processing data...', 'info');
      
      await new Promise(r => setTimeout(r, 500));
    } finally {
      resource[Symbol.dispose]();
    }
    
    await new Promise(r => setTimeout(r, 500));
    addLog('✨ Demo complete!', 'success');
    setIsRunning(false);
  };

  const demoWithError = async () => {
    setIsRunning(true);
    setLogs([]);
    
    addLog('Starting error handling demo...', 'info');
    await new Promise(r => setTimeout(r, 500));
    
    const resource = new Resource('Database Connection');
    
    try {
      await new Promise(r => setTimeout(r, 500));
      resource.use();
      
      await new Promise(r => setTimeout(r, 500));
      addLog('⚠️  Simulating error...', 'warning');
      
      await new Promise(r => setTimeout(r, 500));
      throw new Error('Something went wrong!');
    } catch (e) {
      addLog(`💥 Caught error: ${e.message}`, 'error');
    } finally {
      await new Promise(r => setTimeout(r, 500));
      resource[Symbol.dispose]();
      addLog('Resource cleaned up despite error!', 'success');
    }
    
    await new Promise(r => setTimeout(r, 500));
    addLog('✨ Demo complete!', 'success');
    setIsRunning(false);
  };

  const demoMultipleResources = async () => {
    setIsRunning(true);
    setLogs([]);
    
    addLog('Starting multiple resources demo...', 'info');
    await new Promise(r => setTimeout(r, 500));
    
    const resources = [];
    
    const db = new Resource('Database');
    resources.push(db);
    await new Promise(r => setTimeout(r, 500));
    
    const cache = new Resource('Cache (depends on DB)');
    resources.push(cache);
    await new Promise(r => setTimeout(r, 500));
    
    const session = new Resource('Session (depends on Cache)');
    resources.push(session);
    await new Promise(r => setTimeout(r, 500));
    
    try {
      db.use();
      await new Promise(r => setTimeout(r, 500));
      
      cache.use();
      await new Promise(r => setTimeout(r, 500));
      
      session.use();
      await new Promise(r => setTimeout(r, 500));
      
      addLog('All resources in use...', 'info');
      await new Promise(r => setTimeout(r, 500));
    } finally {
      addLog('Disposing in REVERSE order...', 'warning');
      await new Promise(r => setTimeout(r, 500));
      
      while (resources.length > 0) {
        resources.pop()[Symbol.dispose]();
        await new Promise(r => setTimeout(r, 500));
      }
    }
    
    addLog('✨ Demo complete!', 'success');
    setIsRunning(false);
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'success': return '#22c55e';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'dispose': return '#f97316';
      default: return '#d1d5db';
    }
  };

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '2rem auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: 'linear-gradient(135deg, #ccfbf1 0%, #cffafe 100%)',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '1px solid #5eead4'
    }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', margin: '0 0 0.5rem 0' }}>
          Using Declarations Interactive Demo
        </h3>
        <p style={{ color: '#475569', margin: 0, fontSize: '0.95rem' }}>
          Watch automatic resource cleanup in action (simulating the <code style={{ background: 'white', padding: '0 0.25rem', borderRadius: '2px' }}>using</code> keyword)
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button
          onClick={demoBasicUsage}
          disabled={isRunning}
          style={{
            padding: '0.75rem 1.25rem',
            background: isRunning ? '#94a3b8' : '#14b8a6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: isRunning ? 'not-allowed' : 'pointer'
          }}
        >
          Basic Usage
        </button>
        
        <button
          onClick={demoWithError}
          disabled={isRunning}
          style={{
            padding: '0.75rem 1.25rem',
            background: isRunning ? '#94a3b8' : '#f97316',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: isRunning ? 'not-allowed' : 'pointer'
          }}
        >
          Error Handling
        </button>
        
        <button
          onClick={demoMultipleResources}
          disabled={isRunning}
          style={{
            padding: '0.75rem 1.25rem',
            background: isRunning ? '#94a3b8' : '#06b6d4',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: isRunning ? 'not-allowed' : 'pointer'
          }}
        >
          Multiple Resources
        </button>
      </div>

      {logs.length > 0 && (
        <div style={{
          background: '#1e293b',
          borderRadius: '8px',
          padding: '1rem',
          fontFamily: '"Courier New", monospace',
          fontSize: '0.875rem',
          marginBottom: '1rem',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          <div style={{ color: '#5eead4', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Resource Lifecycle:
          </div>
          {logs.map((log, i) => (
            <div key={i} style={{ padding: '0.25rem 0', color: getLogColor(log.type) }}>
              <span style={{ color: '#6b7280', marginRight: '0.5rem' }}>[{log.time}]</span>
              {log.message}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'white', borderRadius: '8px', padding: '1rem', border: '1px solid #d1d5db' }}>
          <div style={{ fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>
            ❌ Without <code style={{ background: '#f3f4f6', padding: '0 0.25rem', borderRadius: '2px', fontSize: '0.875rem' }}>using</code>:
          </div>
          <pre style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', background: '#f9fafb', padding: '0.75rem', borderRadius: '6px', overflowX: 'auto' }}>
{`const resource = acquire();
try {
  resource.use();
} finally {
  resource.dispose(); // Manual!
}`}
          </pre>
        </div>

        <div style={{ background: 'white', borderRadius: '8px', padding: '1rem', border: '2px solid #14b8a6' }}>
          <div style={{ fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>
            ✅ With <code style={{ background: '#f3f4f6', padding: '0 0.25rem', borderRadius: '2px', fontSize: '0.875rem' }}>using</code>:
          </div>
          <pre style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', background: '#f9fafb', padding: '0.75rem', borderRadius: '6px', overflowX: 'auto' }}>
{`using resource = acquire();
resource.use();
// Automatic cleanup!`}
          </pre>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '8px', padding: '1rem', marginTop: '1rem' }}>
        <div style={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>
          Key Features:
        </div>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
            Resources are disposed automatically when leaving scope
          </li>
          <li style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
            Works even if errors are thrown
          </li>
          <li style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
            Multiple resources dispose in <strong>reverse order</strong>
          </li>
          <li style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
            Implements <code style={{ background: '#f3f4f6', padding: '0 0.25rem', borderRadius: '2px' }}>Symbol.dispose</code> or <code style={{ background: '#f3f4f6', padding: '0 0.25rem', borderRadius: '2px' }}>Symbol.asyncDispose</code>
          </li>
        </ul>
      </div>
    </div>
  );
}


export function Float16ArrayDemo() {
  const [testValue, setTestValue] = React.useState(3.141592653);
  const [results, setResults] = React.useState(null);
  const [arraySize, setArraySize] = React.useState(1000);

  const runComparison = () => {
    // Polyfill Math.f16round if not available
    const f16round = Math.f16round || function(x) {
      // Simplified approximation - real implementation is more complex
      const float32 = new Float32Array([x])[0];
      return Math.round(float32 * 2048) / 2048;
    };

    const float16Value = f16round(testValue);
    const float32Value = new Float32Array([testValue])[0];
    const float64Value = testValue;

    const error16 = Math.abs(float16Value - testValue) / testValue * 100;
    const error32 = Math.abs(float32Value - testValue) / testValue * 100;

    setResults({
      original: testValue,
      float16: float16Value,
      float32: float32Value,
      float64: float64Value,
      error16: error16,
      error32: error32
    });
  };

  const calculateMemory = () => {
    const bytes16 = arraySize * 2; // 16 bits = 2 bytes
    const bytes32 = arraySize * 4; // 32 bits = 4 bytes
    const bytes64 = arraySize * 8; // 64 bits = 8 bytes

    const savings32 = ((bytes32 - bytes16) / bytes32 * 100).toFixed(1);
    const savings64 = ((bytes64 - bytes16) / bytes64 * 100).toFixed(1);

    return {
      bytes16,
      bytes32,
      bytes64,
      kb16: (bytes16 / 1024).toFixed(2),
      kb32: (bytes32 / 1024).toFixed(2),
      kb64: (bytes64 / 1024).toFixed(2),
      savings32,
      savings64
    };
  };

  const memory = calculateMemory();

  const presetValues = [
    { name: 'π (Pi)', value: Math.PI },
    { name: 'Small number', value: 0.00001 },
    { name: 'Large number', value: 999.999 },
    { name: 'E (Euler)', value: Math.E },
  ];

  const formatError = (error) => {
    if (error < 0.001) return '<0.001%';
    return error.toFixed(4) + '%';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg shadow-lg border border-emerald-200">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Float16Array Interactive Demo</h3>
        <p className="text-gray-600">
          Compare precision and memory usage of different float types
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Test Value
          </label>
          <input
            type="number"
            step="any"
            value={testValue}
            onChange={(e) => setTestValue(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
            style={{ background: 'white', color: '#1e293b', boxSizing: 'border-box' }}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {presetValues.map((preset, i) => (
              <button
                key={i}
                onClick={() => setTestValue(preset.value)}
                className="px-2 py-1 bg-white border border-emerald-300 rounded text-xs text-gray-800 hover:bg-emerald-100 transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Array Size (for memory comparison)
          </label>
          <input
            type="number"
            value={arraySize}
            onChange={(e) => setArraySize(parseInt(e.target.value) || 1000)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
            style={{ background: 'white', color: '#1e293b', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      <button
        onClick={runComparison}
        className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors mb-6"
      >
        Compare Float Types
      </button>

      {results && (
        <div className="space-y-4 mb-6">
          <div className="bg-white rounded-lg border-2 border-gray-300 overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 font-semibold">
              Precision Comparison
            </div>
            <div className="divide-y divide-gray-200">
              <div className="p-4 bg-gray-50">
                <div className="text-sm text-gray-600 mb-1">Original Value</div>
                <div className="font-mono text-lg">{results.original}</div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-orange-700">Float16</div>
                    <div className="font-mono text-lg">{results.float16}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Error</div>
                    <div className="font-semibold text-orange-600">{formatError(results.error16)}</div>
                  </div>
                </div>
                <div className="mt-2 bg-orange-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-orange-500 h-full"
                    style={{ width: `${Math.min(results.error16 * 1000, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-blue-700">Float32</div>
                    <div className="font-mono text-lg">{results.float32}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Error</div>
                    <div className="font-semibold text-blue-600">{formatError(results.error32)}</div>
                  </div>
                </div>
                <div className="mt-2 bg-blue-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full"
                    style={{ width: `${Math.min(results.error32 * 1000, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-green-700">Float64</div>
                    <div className="font-mono text-lg">{results.float64}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Error</div>
                    <div className="font-semibold text-green-600">0%</div>
                  </div>
                </div>
                <div className="mt-2 bg-green-100 rounded-full h-2"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border-2 border-emerald-300 overflow-hidden">
        <div className="bg-emerald-100 px-4 py-2 border-b border-emerald-300 font-semibold text-emerald-900">
          Memory Usage (for {arraySize.toLocaleString()} numbers)
        </div>
        <div className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-32 text-sm font-semibold text-orange-700">Float16Array</div>
              <div className="flex-1 bg-orange-100 rounded-full h-6 overflow-hidden relative">
                <div 
                  className="bg-orange-500 h-full flex items-center justify-end pr-2"
                  style={{ width: `${(memory.bytes16 / memory.bytes64) * 100}%` }}
                >
                  <span className="text-white text-xs font-semibold">{memory.kb16} KB</span>
                </div>
              </div>
              <div className="text-sm text-green-600 font-semibold w-24 text-right">
                -{memory.savings64}%
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-32 text-sm font-semibold text-blue-700">Float32Array</div>
              <div className="flex-1 bg-blue-100 rounded-full h-6 overflow-hidden relative">
                <div 
                  className="bg-blue-500 h-full flex items-center justify-end pr-2"
                  style={{ width: `${(memory.bytes32 / memory.bytes64) * 100}%` }}
                >
                  <span className="text-white text-xs font-semibold">{memory.kb32} KB</span>
                </div>
              </div>
              <div className="text-sm text-green-600 font-semibold w-24 text-right">
                -{memory.savings32}%
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-32 text-sm font-semibold text-gray-700">Float64Array</div>
              <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden relative">
                <div 
                  className="bg-gray-500 h-full flex items-center justify-end pr-2"
                  style={{ width: '100%' }}
                >
                  <span className="text-white text-xs font-semibold">{memory.kb64} KB</span>
                </div>
              </div>
              <div className="text-sm text-gray-600 font-semibold w-24 text-right">
                baseline
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-lg p-4 text-sm">
        <div className="font-semibold text-gray-700 mb-2">Use Cases:</div>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li><strong>ML/AI:</strong> Model weights where high precision isn't critical (50% memory savings)</li>
          <li><strong>GPU:</strong> Texture data and graphics where 16-bit is sufficient</li>
          <li><strong>Audio:</strong> Signal processing where storage matters more than precision</li>
          <li><strong>IoT:</strong> Sensor data transmission where bandwidth is limited</li>
        </ul>
      </div>
    </div>
  );
}