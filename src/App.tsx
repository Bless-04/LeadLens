import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { DemoModal } from './components/DemoModal';
import { HomeScreen } from './screens/HomeScreen';
import { CameraScreen } from './screens/CameraScreen';
import { PipeCheckScreen } from './screens/PipeCheckScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { LearnScreen } from './screens/LearnScreen';
import { PipeCheckAnswers, PipeAnalysisResult, DemoScenario, ScreenType } from './types/pipe';
import { analyzePipe } from './services/pipeAnalysis';

const MapScreen = lazy(() => import('./screens/MapScreen'));

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [pipePhotoUrl, setPipePhotoUrl] = useState<string | undefined>(undefined);
  const [answers, setAnswers] = useState<Partial<PipeCheckAnswers>>({});
  const [analysisResult, setAnalysisResult] = useState<PipeAnalysisResult | null>(null);
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);

  // Ensure scroll resets cleanly to top on every screen transition
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [currentScreen]);

  const handleStartCheck = () => {
    setIsDemoActive(false);
    setAnswers({});
    setPipePhotoUrl(undefined);
    setCurrentScreen('camera');
  };

  const handlePhotoSelected = (photoUrl: string) => {
    setPipePhotoUrl(photoUrl);
    setAnswers((prev) => ({ ...prev, pipePhotoUrl: photoUrl }));
    setCurrentScreen('check');
  };

  const handleSkipPhoto = () => {
    setPipePhotoUrl(undefined);
    setAnswers((prev) => ({ ...prev, pipePhotoUrl: undefined }));
    setCurrentScreen('check');
  };

  const handlePipeCheckSubmit = (submittedAnswers: PipeCheckAnswers) => {
    const fullAnswers = {
      ...submittedAnswers,
      pipePhotoUrl: pipePhotoUrl || submittedAnswers.pipePhotoUrl,
      isDemo: isDemoActive || submittedAnswers.isDemo,
    };
    setAnswers(fullAnswers);
    const result = analyzePipe(fullAnswers);
    setAnalysisResult(result);
    setCurrentScreen('results');
  };

  const handleSelectDemoScenario = (scenario: DemoScenario) => {
    setIsDemoActive(true);
    setPipePhotoUrl(scenario.imageUrl);
    const demoAnswers: PipeCheckAnswers = {
      ...scenario.answers,
      pipePhotoUrl: scenario.imageUrl,
      isDemo: true,
    };
    setAnswers(demoAnswers);
    const result = analyzePipe(demoAnswers);
    setAnalysisResult(result);
    setCurrentScreen('results');
  };

  const handleExitDemo = () => {
    setIsDemoActive(false);
    setAnswers({});
    setPipePhotoUrl(undefined);
    setAnalysisResult(null);
    setCurrentScreen('home');
  };

  const handleRetest = () => {
    setIsDemoActive(false);
    setAnswers({});
    setPipePhotoUrl(undefined);
    setAnalysisResult(null);
    setCurrentScreen('camera');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        isDemoActive={isDemoActive}
        onExitDemo={handleExitDemo}
      />

      {/* Main Content Area centered for mobile layout */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-4">
        {currentScreen === 'home' && (
          <HomeScreen
            onStartCheck={handleStartCheck}
            onSelectDemo={handleSelectDemoScenario}
            onNavigateToLearn={() => setCurrentScreen('learn')}
          />
        )}

        {currentScreen === 'camera' && (
          <CameraScreen
            onPhotoSelected={handlePhotoSelected}
            onSkipPhoto={handleSkipPhoto}
            onBack={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'check' && (
          <PipeCheckScreen
            initialAnswers={answers}
            pipePhotoUrl={pipePhotoUrl}
            isDemo={isDemoActive}
            onSubmit={handlePipeCheckSubmit}
            onBack={() => setCurrentScreen('camera')}
          />
        )}

        {currentScreen === 'results' && analysisResult && (
          <ResultsScreen
            result={analysisResult}
            photoUrl={pipePhotoUrl}
            onRetest={handleRetest}
            onNavigateToLearn={() => setCurrentScreen('learn')}
            onOpenMap={() => setCurrentScreen('map')}
          />
        )}

        {currentScreen === 'learn' && <LearnScreen />}
        {currentScreen === 'map' && (
          <Suspense fallback={<p role="status">Loading map…</p>}>
            <MapScreen />
          </Suspense>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={(screen) => screen === 'camera' ? handleStartCheck() : setCurrentScreen(screen)}
        onOpenDemoPicker={() => setIsDemoModalOpen(true)}
      />

      {/* Demo Scenarios Modal Dialog */}
      <DemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onSelectScenario={handleSelectDemoScenario}
      />
    </div>
  );
};

export default App;
