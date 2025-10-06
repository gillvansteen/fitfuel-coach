"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Target, 
  Activity, 
  Droplets, 
  Scale, 
  Calculator,
  TrendingUp,
  Apple,
  Dumbbell,
  Heart,
  Flame
} from 'lucide-react'

interface UserProfile {
  name: string
  age: number
  gender: 'male' | 'female'
  weight: number
  height: number
  activityLevel: string
  goal: string
  bmi: number
  bmr: number
  dailyCalories: number
}

interface DailyTracking {
  calories: number
  water: number
  weight: number
  date: string
}

export default function FitFuel() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: 25,
    gender: 'male',
    weight: 70,
    height: 175,
    activityLevel: 'moderate',
    goal: 'maintain',
    bmi: 0,
    bmr: 0,
    dailyCalories: 0
  })
  
  const [dailyTracking, setDailyTracking] = useState<DailyTracking>({
    calories: 0,
    water: 0,
    weight: profile.weight,
    date: new Date().toISOString().split('T')[0]
  })

  const [calorieInput, setCalorieInput] = useState('')
  const [waterGlasses, setWaterGlasses] = useState(0)

  // Calculadora BMI e BMR
  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1))
  }

  const calculateBMR = (weight: number, height: number, age: number, gender: string) => {
    if (gender === 'male') {
      return Math.round(88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age))
    } else {
      return Math.round(447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age))
    }
  }

  const calculateDailyCalories = (bmr: number, activityLevel: string, goal: string) => {
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    }
    
    const baseCalories = bmr * (activityMultipliers[activityLevel as keyof typeof activityMultipliers] || 1.55)
    
    switch (goal) {
      case 'lose':
        return Math.round(baseCalories - 500)
      case 'gain':
        return Math.round(baseCalories + 500)
      default:
        return Math.round(baseCalories)
    }
  }

  // Atualizar cálculos quando perfil muda
  useEffect(() => {
    const bmi = calculateBMI(profile.weight, profile.height)
    const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.gender)
    const dailyCalories = calculateDailyCalories(bmr, profile.activityLevel, profile.goal)
    
    setProfile(prev => ({
      ...prev,
      bmi,
      bmr,
      dailyCalories
    }))
  }, [profile.weight, profile.height, profile.age, profile.gender, profile.activityLevel, profile.goal])

  const addCalories = () => {
    const calories = parseInt(calorieInput)
    if (calories && calories > 0) {
      setDailyTracking(prev => ({
        ...prev,
        calories: prev.calories + calories
      }))
      setCalorieInput('')
    }
  }

  const addWater = () => {
    setWaterGlasses(prev => prev + 1)
    setDailyTracking(prev => ({
      ...prev,
      water: prev.water + 250 // 250ml por copo
    }))
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Ondergewicht', color: 'bg-blue-500' }
    if (bmi < 25) return { category: 'Normaal', color: 'bg-green-500' }
    if (bmi < 30) return { category: 'Overgewicht', color: 'bg-yellow-500' }
    return { category: 'Obesitas', color: 'bg-red-500' }
  }

  const calorieProgress = (dailyTracking.calories / profile.dailyCalories) * 100
  const waterProgress = (dailyTracking.water / 2000) * 100 // 2L doel

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FitFuel
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Jouw persoonlijke fitness & voeding companion
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profiel
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="flex items-center gap-2">
              <Apple className="w-4 h-4" />
              Voeding
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Voortgang
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Calorie Card */}
              <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Flame className="w-5 h-5" />
                    Calorieën
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    {dailyTracking.calories} / {profile.dailyCalories}
                  </div>
                  <Progress value={calorieProgress} className="bg-white/20" />
                  <p className="text-sm mt-2 opacity-90">
                    {Math.max(0, profile.dailyCalories - dailyTracking.calories)} nog te gaan
                  </p>
                </CardContent>
              </Card>

              {/* Water Card */}
              <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Droplets className="w-5 h-5" />
                    Water
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    {(dailyTracking.water / 1000).toFixed(1)}L / 2.0L
                  </div>
                  <Progress value={waterProgress} className="bg-white/20" />
                  <p className="text-sm mt-2 opacity-90">
                    {waterGlasses} glazen gedronken
                  </p>
                </CardContent>
              </Card>

              {/* BMI Card */}
              <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Heart className="w-5 h-5" />
                    BMI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    {profile.bmi}
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {getBMICategory(profile.bmi).category}
                  </Badge>
                </CardContent>
              </Card>

              {/* Weight Card */}
              <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Scale className="w-5 h-5" />
                    Gewicht
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    {profile.weight} kg
                  </div>
                  <p className="text-sm opacity-90">
                    Doel: {profile.goal === 'lose' ? 'Afvallen' : profile.goal === 'gain' ? 'Aankomen' : 'Onderhouden'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Apple className="w-5 h-5" />
                    Calorieën Toevoegen
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Aantal calorieën"
                      value={calorieInput}
                      onChange={(e) => setCalorieInput(e.target.value)}
                    />
                    <Button onClick={addCalories} className="bg-gradient-to-r from-orange-500 to-red-500">
                      Toevoegen
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={() => setCalorieInput('300')}>
                      Ontbijt (300)
                    </Button>
                    <Button variant="outline" onClick={() => setCalorieInput('500')}>
                      Lunch (500)
                    </Button>
                    <Button variant="outline" onClick={() => setCalorieInput('600')}>
                      Diner (600)
                    </Button>
                    <Button variant="outline" onClick={() => setCalorieInput('150')}>
                      Snack (150)
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="w-5 h-5" />
                    Water Tracker
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={addWater} 
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500"
                  >
                    + 1 Glas Water (250ml)
                  </Button>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{waterGlasses}</p>
                    <p className="text-sm text-gray-600">glazen vandaag</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Persoonlijk Profiel
                </CardTitle>
                <CardDescription>
                  Vul je gegevens in voor gepersonaliseerde aanbevelingen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Naam</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Je naam"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age">Leeftijd</Label>
                    <Input
                      id="age"
                      type="number"
                      value={profile.age}
                      onChange={(e) => setProfile(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Geslacht</Label>
                    <Select value={profile.gender} onValueChange={(value: 'male' | 'female') => setProfile(prev => ({ ...prev, gender: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Man</SelectItem>
                        <SelectItem value="female">Vrouw</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Gewicht (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={profile.weight}
                      onChange={(e) => setProfile(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">Lengte (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={profile.height}
                      onChange={(e) => setProfile(prev => ({ ...prev, height: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activity">Activiteitsniveau</Label>
                    <Select value={profile.activityLevel} onValueChange={(value) => setProfile(prev => ({ ...prev, activityLevel: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Zittend werk</SelectItem>
                        <SelectItem value="light">Licht actief</SelectItem>
                        <SelectItem value="moderate">Matig actief</SelectItem>
                        <SelectItem value="active">Zeer actief</SelectItem>
                        <SelectItem value="very_active">Extreem actief</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goal">Doel</Label>
                    <Select value={profile.goal} onValueChange={(value) => setProfile(prev => ({ ...prev, goal: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lose">Afvallen</SelectItem>
                        <SelectItem value="maintain">Gewicht behouden</SelectItem>
                        <SelectItem value="gain">Aankomen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calculators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calculator className="w-5 h-5" />
                    BMI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-center mb-2">
                    {profile.bmi}
                  </div>
                  <div className="text-center">
                    <Badge className={getBMICategory(profile.bmi).color}>
                      {getBMICategory(profile.bmi).category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="w-5 h-5" />
                    BMR
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-center mb-2">
                    {profile.bmr}
                  </div>
                  <p className="text-sm text-center text-gray-600">
                    cal/dag in rust
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Flame className="w-5 h-5" />
                    Dagelijkse Calorieën
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-center mb-2">
                    {profile.dailyCalories}
                  </div>
                  <p className="text-sm text-center text-gray-600">
                    voor je doel
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Nutrition Tab */}
          <TabsContent value="nutrition" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Apple className="w-5 h-5" />
                    Vandaag Gegeten
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Totaal calorieën:</span>
                      <span className="font-bold text-lg">{dailyTracking.calories}</span>
                    </div>
                    <Progress value={calorieProgress} className="h-3" />
                    <div className="text-sm text-gray-600">
                      {calorieProgress > 100 ? 
                        `${Math.round(dailyTracking.calories - profile.dailyCalories)} calorieën over limiet` :
                        `${Math.round(profile.dailyCalories - dailyTracking.calories)} calorieën resterend`
                      }
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="w-5 h-5" />
                    Water Inname
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Totaal water:</span>
                      <span className="font-bold text-lg">{(dailyTracking.water / 1000).toFixed(1)}L</span>
                    </div>
                    <Progress value={waterProgress} className="h-3" />
                    <div className="text-sm text-gray-600">
                      Doel: 2.0L per dag ({waterGlasses} glazen)
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Meal Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle>Maaltijd Suggesties</CardTitle>
                <CardDescription>
                  Gezonde maaltijden passend bij je calorie doel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Ontbijt</h4>
                    <p className="text-sm text-gray-600 mb-2">Havermout met fruit</p>
                    <Badge variant="secondary">~300 cal</Badge>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Lunch</h4>
                    <p className="text-sm text-gray-600 mb-2">Salade met kip</p>
                    <Badge variant="secondary">~450 cal</Badge>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Diner</h4>
                    <p className="text-sm text-gray-600 mb-2">Zalm met groenten</p>
                    <Badge variant="secondary">~550 cal</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="w-5 h-5" />
                    Gewicht Tracker
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Huidig gewicht (kg)"
                        value={dailyTracking.weight}
                        onChange={(e) => setDailyTracking(prev => ({ 
                          ...prev, 
                          weight: parseFloat(e.target.value) || 0 
                        }))}
                      />
                      <Button 
                        onClick={() => setProfile(prev => ({ ...prev, weight: dailyTracking.weight }))}
                        className="bg-gradient-to-r from-purple-500 to-pink-500"
                      >
                        Update
                      </Button>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{profile.weight} kg</p>
                      <p className="text-sm text-gray-600">Huidig gewicht</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Voortgang Overzicht
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>BMI:</span>
                      <span className="font-semibold">{profile.bmi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dagelijkse calorieën:</span>
                      <span className="font-semibold">{profile.dailyCalories}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vandaag gegeten:</span>
                      <span className="font-semibold">{dailyTracking.calories} cal</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Water gedronken:</span>
                      <span className="font-semibold">{(dailyTracking.water / 1000).toFixed(1)}L</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Goals */}
            <Card>
              <CardHeader>
                <CardTitle>Week Doelen</CardTitle>
                <CardDescription>
                  Houd je wekelijkse doelstellingen bij
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">5/7</div>
                    <p className="text-sm">Dagen calorie doel behaald</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">14L</div>
                    <p className="text-sm">Water deze week</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">-0.5kg</div>
                    <p className="text-sm">Gewichtsverandering</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}