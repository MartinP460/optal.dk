import { config } from '@optaldk/eslint-config-custom'

export default [
    ...config,
    {
        ignores: ['.svelte-kit', 'src/lib/components/ui']
    }
]