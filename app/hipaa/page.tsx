"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldCheck, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function HipaaPage() {
	const router = useRouter()
	return (
		<div className="min-h-screen bg-gradient-to-br from-[#F4F3EC] via-[#D2CDB9] to-[#92A378]">
			<header className="bg-white/90 backdrop-blur-sm border-b border-border sticky top-0 z-50">
				<div className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
								<ShieldCheck className="w-6 h-6 text-primary-foreground" />
							</div>
							<div>
								<h1 className="text-2xl font-bold text-primary font-[family-name:var(--font-heading)]">HIPAA Compliance</h1>
								<p className="text-xs text-muted-foreground">How we protect your PHI</p>
							</div>
						</div>
						<Button variant="outline" size="sm" onClick={() => router.push('/')}> 
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Home
						</Button>
					</div>
				</div>
			</header>

			<section className="py-16 px-4">
				<div className="container mx-auto max-w-4xl space-y-8">
					<Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="text-3xl font-[family-name:var(--font-heading)]">Our Commitment</CardTitle>
						</CardHeader>
						<CardContent className="leading-relaxed text-muted-foreground space-y-4">
							<p>We are committed to protecting the privacy and security of your Protected Health Information (PHI) in accordance with the Health Insurance Portability and Accountability Act (HIPAA) and applicable state laws.</p>
						</CardContent>
					</Card>

					<Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="font-[family-name:var(--font-heading)]">Safeguards</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3 text-muted-foreground">
							<ul className="list-disc pl-6 space-y-2">
								<li>Administrative policies and workforce training</li>
								<li>Technical safeguards including encryption and access controls</li>
								<li>Physical controls to secure facilities and equipment</li>
							</ul>
						</CardContent>
					</Card>

					<Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="font-[family-name:var(--font-heading)]">Your Rights Under HIPAA</CardTitle>
						</CardHeader>
						<CardContent className="text-muted-foreground space-y-2">
							<ul className="list-disc pl-6 space-y-2">
								<li>Access, review, and request copies of your PHI</li>
								<li>Request amendments to your records</li>
								<li>Receive an accounting of disclosures</li>
								<li>Request restrictions and confidential communications</li>
							</ul>
						</CardContent>
					</Card>

					<Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="font-[family-name:var(--font-heading)]">Contact & Complaints</CardTitle>
						</CardHeader>
						<CardContent className="text-muted-foreground">
							<p>If you have questions or concerns about your privacy, contact us at <a className="text-primary underline" href="mailto:privacy@alturoshealth.com">privacy@alturoshealth.com</a>. You may also file a complaint with the U.S. Department of Health and Human Services.</p>
						</CardContent>
					</Card>
				</div>
			</section>
		</div>
	)
}
