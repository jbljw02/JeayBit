import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
    // 모듈 import 시 대체할 가짜 모듈 매핑 설정
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/__mocks__/fileMock.ts'
    },
    // TypeScript/TSX 파일 변환 설정
    transform: {
        // ts-jest를 사용하여 TypeScript 파일을 JavaScript로 변환
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: 'tsconfig.json'
        }]
    },
    // 테스트 파일 매칭 패턴 설정
    testMatch: [
        // __tests__ 폴더 내의 모든 ts/tsx 파일
        '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
        // .spec 또는 .test 확장자를 가진 모든 ts/tsx 파일
        '<rootDir>/src/**/*.{spec,test}.{ts,tsx}'
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testPathIgnorePatterns: ['/node_modules/'],
    // 테스트 커버리지 결과가 저장될 디렉토리
    coverageDirectory: 'coverage',
    // 커버리지 측정 대상 파일 설정
    collectCoverageFrom: [
        // src 폴더의 모든 ts/tsx 파일 포함
        'src/**/*.{ts,tsx}',
        // 타입 정의 파일 제외
        '!src/**/*.d.ts',
        // 진입점 파일 제외
        '!src/index.tsx',
    ]
};

export default config;