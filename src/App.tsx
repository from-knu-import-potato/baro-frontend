import { Button } from '@/shadcn/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shadcn/ui/card';

function App() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-100">
        <CardHeader>
          <CardTitle className="text-xl">바로: BARO</CardTitle>
          <CardDescription>AI & OCR 기반 스마트 재고 관리 서비스</CardDescription>
        </CardHeader>
        <CardContent>
          현재 프로젝트 세팅 중입니다 <br />
          4월 30일 사전 교육 종료 후 개발 시작 예정입니다
        </CardContent>
        <CardFooter className="flex-col gap-2 border-gray-200 dark:border-gray-800">
          <Button
            onClick={() =>
              window.open(
                'https://github.com/from-knu-import-potato',
                '_blank',
                'noopener,noreferrer',
              )
            }
            className="w-full py-4.5"
          >
            BARO Github 구경가기
          </Button>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full py-4.5 border-gray-200"
          >
            이전 페이지로 돌아가기
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;
